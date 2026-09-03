#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
BASE_URL="${BASE_URL:-http://localhost:${PORT}}"
REDIS_URL="${REDIS_URL:-redis://localhost:6379}"
WIREMOCK_BASE_URL="${WIREMOCK_BASE_URL:-http://localhost:9091}"
MOCK_AUTH="${MOCK_AUTH:-true}"
LOG_FILE="${LOG_FILE:-/tmp/hmpps-launchpad-home-ui-mock.log}"
PORT_NUMBER="${PORT##*:}"

export PORT BASE_URL REDIS_URL WIREMOCK_BASE_URL MOCK_AUTH

is_app_ready() {
  local status_code
  status_code="$(curl -s -o /dev/null -w '%{http_code}' "${BASE_URL}/sign-in" || true)"
  [[ "${status_code}" == "200" || "${status_code}" == "302" || "${status_code}" == "303" ]]
}

docker_conflicts=""
if command -v docker >/dev/null 2>&1; then
  docker_conflicts="$(docker ps --filter "publish=${PORT_NUMBER}" --format '{{.ID}}' | tr '\n' ' ')"
fi

if [ -n "${docker_conflicts// /}" ]; then
  echo "Stopping Docker containers publishing port ${PORT_NUMBER} so Playwright hits the local mock app..."
  docker stop ${docker_conflicts} >/dev/null
fi

# A stale app instance can remain running from an earlier mock/dev session and keep
# the old environment values alive. Ensure we always start from a clean state when
# using the dedicated mock configuration.
if pgrep -af "dist/server.js" >/dev/null 2>&1; then
  echo "Stopping any existing app instance before starting the mock app..."
  pkill -f "dist/server.js" || true
  for attempt in $(seq 1 10); do
    if ! pgrep -af "dist/server.js" >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done
fi

if is_app_ready; then
  echo "Mock app is already running at ${BASE_URL}"
  exit 0
fi

if ! curl -fsS "${WIREMOCK_BASE_URL}/__admin/mappings" >/dev/null 2>&1; then
  echo "WireMock is not available at ${WIREMOCK_BASE_URL}. Start the local test services first."
  exit 1
fi

# Use the dedicated mock env file so the app resolves all service URLs to WireMock rather than the live dev environment.
node --env-file=feature.env dist/server.js > "${LOG_FILE}" 2>&1 &
APP_PID=$!

echo "Starting mock app on ${BASE_URL} (pid ${APP_PID})"

for attempt in $(seq 1 30); do
  if is_app_ready; then
    echo "Mock app is ready at ${BASE_URL}"
    exit 0
  fi
  sleep 2
done

echo "Mock app failed to start. Logs:"
tail -n 50 "${LOG_FILE}"
exit 1
