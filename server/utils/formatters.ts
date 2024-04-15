// export const formatBalance = (accountType, balances) => {
//   const failureNotification = createUserNotification('We are not able to show your current balance at this time')

//   try {
//     const balance = balances[accountType]
//     return {
//       amount: formatBalanceOrDefault(null, balance, balances.currency),
//     }
//   } catch (e) {
//     // Sentry.captureException(e)
//     // logger.error('Failed to process balance response')
//     // logger.debug(e.stack)
//     return failureNotification
//   }
// }

// export const createTransactionsResponseFrom = (accountType, transactionsData) => {
//   const { balances, transactions } = transactionsData

//   return {
//     balance: formatBalance(accountType, balances),
//     shouldShowDamageObligationsTab: balances && balances.damageObligations > 0,
//     transactions: createTransactionTableFrom(transactions),
//   }
// }

// export const createPendingTransactionsResponseFrom = pending => {
//   /*
//   const failureNotification = createUserNotification(
//     'We are not able to show information about pending payments at this time',
//   );

//   try {
//     if (!Array.isArray(pending)) {
//       return failureNotification;
//     }

//     const holdingNotCleared = pending
//       .sort((transaction1, transaction2) =>
//         sortByDateTime(
//           transaction2.createDateTime,
//           transaction1.createDateTime,
//         ),
//       )
//       .filter(transaction => !transaction.holdingCleared);

//     return {
//       head: [
//         'Payment date',
//         'Money in',
//         'Money out',
//         'Payment description',
//         'Prison',
//       ].map(toGovUkTableCells),
//       rows: holdingNotCleared.map(
//         ({
//           entryDate,
//           postingType,
//           penceAmount,
//           currency,
//           entryDescription: paymentDescription,
//           prison,
//         }) => {
//           const paymentDate = formatDateOrDefault('', 'd MMMM yyyy', entryDate);
//           const moneyIn =
//             postingType === 'CR'
//               ? formatBalanceOrDefault(null, penceAmount / 100, currency)
//               : '';
//           const moneyOut =
//             postingType === 'CR'
//               ? ''
//               : formatBalanceOrDefault(null, 0 - penceAmount / 100, currency);
//           return [
//             paymentDate,
//             moneyIn,
//             moneyOut,
//             paymentDescription,
//             prison,
//           ].map(toGovUkTableCells);
//         },
//       ),
//     };
//   } catch (e) {
//     Sentry.captureException(e);
//     logger.error('Failed to process pending transactions response');
//     logger.debug(e.stack);
//     return failureNotification;
//   }
//   */
// }

// export const createDamageObligationsResponseFrom = damageObligations => {
//   /*
//   const failureNotification = createUserNotification(
//     'We are not able to show your damage obligations at this time',
//   );

//   try {
//     if (!Array.isArray(damageObligations)) {
//       return failureNotification;
//     }

//     const activeDamageObligations = damageObligations.filter(
//       damageObligation => damageObligation.status === 'ACTIVE',
//     );

//     const totalRemainingAmount = activeDamageObligations
//       .filter(damageObligation => damageObligation.currency === 'GBP')
//       .reduce(
//         (runningTotal, damageObligation) =>
//           runningTotal +
//           (damageObligation.amountToPay - damageObligation.amountPaid),
//         0,
//       );

//     const rows = activeDamageObligations
//       .sort((damageObligation1, damageObligation2) =>
//         sortByDateTime(
//           damageObligation2.startDateTime,
//           damageObligation1.startDateTime,
//         ),
//       )
//       .map(damageObligation => {
//         const startDate = formatDateOrDefault(
//           'Unknown',
//           'd MMMM yyyy',
//           damageObligation.startDateTime,
//         );
//         const endDate = formatDateOrDefault(
//           'Unknown',
//           'd MMMM yyyy',
//           damageObligation.endDateTime,
//         );

//         return {
//           adjudicationNumber: damageObligation.referenceNumber,
//           timePeriod:
//             damageObligation.startDateTime && damageObligation.endDateTime
//               ? `${startDate} to ${endDate}`
//               : 'Unknown',
//           totalAmount: formatBalanceOrDefault(
//             null,
//             damageObligation.amountToPay,
//             damageObligation.currency,
//           ),
//           amountPaid: formatBalanceOrDefault(
//             null,
//             damageObligation.amountPaid,
//             damageObligation.currency,
//           ),
//           amountOwed: formatBalanceOrDefault(
//             null,
//             damageObligation.amountToPay - damageObligation.amountPaid,
//             damageObligation.currency,
//           ),
//           prison: damageObligation.prison,
//           description: damageObligation.comment,
//         };
//       })
//       .map(damageObligation =>
//         [
//           damageObligation.adjudicationNumber,
//           damageObligation.timePeriod,
//           damageObligation.totalAmount,
//           damageObligation.amountPaid,
//           damageObligation.amountOwed,
//           damageObligation.prison,
//           damageObligation.description,
//         ].map(toGovUkTableCells),
//       );

//     return {
//       head: [
//         'Adjudication number',
//         'Payment start and end date',
//         'Total amount',
//         'Amount paid',
//         'Amount owed',
//         'Prison',
//         'Description',
//       ].map(toGovUkTableCells),
//       rows,
//       totalRemainingAmount: formatBalanceOrDefault(
//         null,
//         totalRemainingAmount,
//         'GBP',
//       ),
//     };
//   } catch (e) {
//     Sentry.captureException(e);
//     logger.error('Failed to process damage obligations response');
//     logger.debug(e.stack);
//     return failureNotification;
//   }
//   */
// }
