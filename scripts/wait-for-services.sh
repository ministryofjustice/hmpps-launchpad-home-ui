#!/bin/bash -eo pipefail

echo "🏗️  CI Service Startup Script"
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a service is responding
check_service() {
    local url=$1
    local service_name=$2
    local max_attempts=${3:-30}
    local wait_time=${4:-2}
    
    echo -e "${BLUE}🔍 Checking ${service_name}...${NC}"
    
    for i in $(seq 1 $max_attempts); do
        if curl -f -s --connect-timeout 2 "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ ${service_name} is ready after ${i} attempts${NC}"
            return 0
        fi
        echo -e "${YELLOW}⏳ Waiting for ${service_name} (attempt $i/$max_attempts)...${NC}"
        sleep $wait_time
    done
    
    echo -e "${RED}❌ ${service_name} failed to start after $max_attempts attempts${NC}"
    return 1
}

# Function to initialize basic WireMock stubs for CI
initialize_wiremock_stubs() {
    echo -e "${BLUE}🎭 Initializing basic WireMock stubs for CI...${NC}"
    
    # Basic auth health endpoint
    curl -X POST http://localhost:9091/__admin/mappings \
        -H "Content-Type: application/json" \
        -d '{
            "request": {
                "method": "GET",
                "urlPattern": "/auth/health/ping"
            },
            "response": {
                "status": 200,
                "headers": {
                    "Content-Type": "application/json"
                },
                "jsonBody": {
                    "status": "UP"
                }
            }
        }' > /dev/null 2>&1

    # Basic token verification health endpoint  
    curl -X POST http://localhost:9091/__admin/mappings \
        -H "Content-Type: application/json" \
        -d '{
            "request": {
                "method": "GET", 
                "urlPattern": "/verification/health/ping"
            },
            "response": {
                "status": 200,
                "headers": {
                    "Content-Type": "application/json"
                },
                "jsonBody": {
                    "status": "UP"
                }
            }
        }' > /dev/null 2>&1

    # Basic OAuth token endpoint
    curl -X POST http://localhost:9091/__admin/mappings \
        -H "Content-Type: application/json" \
        -d '{
            "request": {
                "method": "POST",
                "urlPattern": "/auth/oauth/token"
            },
            "response": {
                "status": 200,
                "headers": {
                    "Content-Type": "application/json"
                },
                "jsonBody": {
                    "access_token": "fake-token-for-ci",
                    "token_type": "bearer",
                    "expires_in": 3600
                }
            }
        }' > /dev/null 2>&1

    # Basic token verification endpoint
    curl -X POST http://localhost:9091/__admin/mappings \
        -H "Content-Type: application/json" \
        -d '{
            "request": {
                "method": "POST",
                "urlPattern": "/verification/token/verify"
            },
            "response": {
                "status": 200,
                "headers": {
                    "Content-Type": "application/json"
                },
                "jsonBody": {
                    "active": true
                }
            }
        }' > /dev/null 2>&1

    echo -e "${GREEN}✅ Basic WireMock stubs initialized${NC}"
}

# Main execution
echo -e "${BLUE}🚀 Starting CI service health checks...${NC}"

# Step 1: Wait for WireMock to be ready
if check_service "http://localhost:9091/__admin/health" "WireMock" 15 2; then
    # Step 2: Initialize basic stubs
    initialize_wiremock_stubs
    
    # Step 3: Give WireMock a moment to process stubs
    echo -e "${BLUE}⏳ Allowing WireMock stubs to propagate...${NC}"
    sleep 3
    
    # Step 4: Wait for the main application
    if check_service "http://localhost:3000/health" "Main Application" 30 2; then
        echo -e "${GREEN}🎉 All services are ready!${NC}"
        echo "==============================="
        exit 0
    else
        echo -e "${RED}❌ Main application failed to start${NC}"
        echo -e "${YELLOW}💡 Try checking application logs for authentication errors${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ WireMock failed to start${NC}"
    exit 1
fi