export type PlaceholderItem = { code: string; desc?: string };

export const PLACEHOLDER_GROUPS: Record<string, { title: string; items: PlaceholderItem[] }> = {
  hotelContact: {
    title: 'Hotel - Contact data',
    items: [
      { code: '${curUser}' },
      { code: '${hotel.user}' },
      { code: '${hotel.name}' },
      { code: '${hotel.city}' },
      { code: '${hotel.contactFN}' },
      { code: '${hotel.contactLN}' },
      { code: '${hotel.country}' },
      { code: '${hotel.email}' },
      { code: '${hotel.fax}' },
      { code: '${hotel.homepage}' },
      { code: '${hotel.phone}' },
      { code: '${hotel.state}' },
      { code: '${hotel.street1}' },
      { code: '${hotel.ZIP}' }
    ]
  },
  hotelBusiness: {
    title: 'Hotel - Business data',
    items: [
      { code: '${hotel.account}' },
      { code: '${hotel.bankName}' },
      { code: '${hotel.BLZ}' },
      { code: '${hotel.IBAN}' },
      { code: '${hotel.localCourt}' },
      { code: '${hotel.manager2FN}' },
      { code: '${hotel.manager2LN}' },
      { code: '${hotel.managerFN}' },
      { code: '${hotel.managerLN}' },
      { code: '${hotel.salestaxID}' },
      { code: '${hotel.SWIFT}' },
      { code: '${hotel.taxno}' },
      { code: '${hotel.tradeRegister}' },
      { code: '${hotel.tradeRegisterID}' }
    ]
  },
  reservation: {
    title: 'Reservation / Profile / Address',
    items: [
      { code: '${address.city}' },
      { code: '${address.country}' },
      { code: '${address.state}' },
      { code: '${address.stateName}' },
      { code: '${address.street1}' },
      { code: '${address.street2}' },
      { code: '${address.street3}' },
      { code: '${address.ZIP}' },
      { code: '${curDate}' },
      { code: '${curDateF}' },
      { code: '${curDateM}' },
      { code: '${curDateS}' },
      { code: '${curDateTime}' },
      { code: '${curDateTimeF}' },
      { code: '${curDateTimeM}' },
      { code: '${curDateTimeS}' },
      { code: '${curr}' },
      { code: '${expirationdate}' },
      { code: '${freetext}' },
      { code: '${globalcrsnumber}' },
      { code: '${groupname}' }
    ]
  },
  guest: {
    title: 'Guest / Profile data',
    items: [
      { code: '${guest.birthday}' },
      { code: '${guest.company}' },
      { code: '${guest.companyID}' },
      { code: '${guest.contactFirstName}' },
      { code: '${guest.contactLastName}' },
      { code: '${guest.debitorAccount}' },
      { code: '${guest.defaultRateID}' },
      { code: '${guest.department}' },
      { code: '${guest.email}' },
      { code: '${guest.emails(1)}' },
      { code: '${guest.emails(2)}' },
      { code: '${guest.fax}' },
      { code: '${guest.faxes(1)}' },
      { code: '${guest.faxes(2)}' },
      { code: '${guest.firstName}' },
      { code: '${guest.IATACode}' },
      { code: '${guest.ID}' },
      { code: '${guest.language}' },
      { code: '${guest.lastName}' },
      { code: '${guest.licensePlate}' },
      { code: '${guest.mobilePhone}' },
      { code: '${guest.mobilePhones(1)}' },
      { code: '${guest.mobilePhones(2)}' },
      { code: '${guest.nationality}' },
      { code: '${guest.passport}' },
      { code: '${guest.phone}' },
      { code: '${guest.phones(1)}' },
      { code: '${guest.phones(2)}' },
      { code: '${guest.preferences}' },
      { code: '${guest.salesTaxNumber}' },
      { code: '${guest.salesTaxNumber2}' },
      { code: '${guest.skype}' },
      { code: '${guest.skypes(1)}' },
      { code: '${guest.skypes(2)}' },
      { code: '${guest.memberCardType}' },
      { code: '${guest.memberCardNumber}' }
    ]
  },
  invoice: {
    title: 'Invoice data',
    items: [
      { code: '${invoice.guest.firstName}' },
      { code: '${invoice.guest.lastName}' },
      { code: '${invoice.guest.address.street1}' },
      { code: '${invoice.guest.address.street2}' },
      { code: '${invoice.guest.address.ZIP}' },
      { code: '${invoice.guest.address.city}' },
      { code: '${invoice.guest.address.country}' },
      { code: '${arrival}' },
      { code: '${closingDate}' },
      { code: '${debitorAccount}' },
      { code: '${departure}' },
      { code: '${externalFiscalClosureID}' },
      { code: '${externalFiscalCode}' },
      { code: '${externalFiscalizationDate}' },
      { code: '${fiscalizationDate}' },
      { code: '${guests}' },
      { code: '${inv.fiscalCode}' },
      { code: '${inv.invoiceCode}' },
      { code: '${invDate}' },
      { code: '${inv.invoiceDate}' },
      { code: '${inv.dueDate}' },
      { code: '${inv.invoiceName}' },
      { code: '${inv.totalAmount}' },
      { code: '${inv.totalChargedAmount}' },
      { code: '${invoiceType}' },
      { code: '${item.netAmount}' },
      { code: '${item.grossAmount}' },
      { code: '${invCode}' },
      { code: '${totalBrutto}' },
      { code: '${totalNetto}' },
      { code: '${totalTax}' }
    ]
  },
  group: {
    title: 'Group reservations / invoices',
    items: [
      { code: '${entry.arrival}' },
      { code: '${entry.departure}' },
      { code: '${entry.categories}' },
      { code: '${entry.count}' },
      { code: '${entry.dailyfullprice}' },
      { code: '${entry.departureT.full}' },
      { code: '${entry.fullprice}' },
      { code: '${entry.guestCount}' },
      { code: '${entry.guests}' },
      { code: '${entry.nights}' },
      { code: '${entry.occupancyName}' },
      { code: '${resGrp.ID}' },
      { code: '${resGrpName}' }
    ]
  },
  registration: {
    title: 'Registration form / special codes',
    items: [
      { code: '${arrivalDate.dateTimeFull}' },
      { code: '${arrivalDate.dateTimeLong}' },
      { code: '${arrivalDate.dateTimeShort}' },
      { code: '${arrivalDate.full}' },
      { code: '${arrivalDate.long}' },
      { code: '${arrivalDate.short}' },
      { code: '${arrivalDate.timeFull}' },
      { code: '${arrivalDate.timeLong}' },
      { code: '${arrivalDate.timeShort}' },
      { code: "${departureDate.format('yyyyMMdd')}" },
      { code: '${departureDate.dateTimeFull}' },
      { code: '${departureDate.dateTimeLong}' },
      { code: '${departureDate.dateTimeShort}' },
      { code: '${departureDate.full}' },
      { code: '${departureDate.long}' },
      { code: '${departureDate.short}' },
      { code: '${departureDate.timeFull}' },
      { code: '${departureDate.timeLong}' },
      { code: '${departureDate.timeShort}' },
      { code: '${gender}' },
      { code: '${guest.gender.char}' },
      { code: '${guest.birthCountry}' },
      { code: '${guest.birthdayFull}' },
      { code: '${travelDocument.number}' },
      { code: '${travelDocument.name}' },
      { code: '${travelDocument.shortName}' }
    ]
  },
  userDefined: {
    title: 'User-defined fields (UDF)',
    items: [
      { code: "${guest.udf.chosen identifier}" },
      { code: "${res.udf.chosen identifier}" },
      { code: "${entry.catObject.udf.identifier}" },
      { code: "${group.udf.identifier}" }
    ]
  },
  misc: {
    title: 'Misc / QR / Payments / Currency',
    items: [
      { code: '${qrcodeinfo}' },
      { code: '${payments}' },
      { code: "${payments?string(\"0.00\")}" },
      { code: '${forexAmountFrom}' },
      { code: '${forexAmountTo}' },
      { code: '${hotel.customerId}' }
    ]
  }
  ,
  reservationExtras: {
    title: 'Reservation - core & extras',
    items: [
      { code: '${res.creationDate}' },
      { code: '${res.ID}' },
      { code: '${resNR}' },
      { code: '${res.reservationGroupID}' },
      { code: '${res.reservationGroupName}' },
      { code: '${res.stateNames}' },
      { code: '${res.stats.adultCount}' },
      { code: '${res.stats.guestCount}' },
      { code: '${res.stats.ageGroupCount(1)}' },
      { code: '${res.stats.ageGroupCount(2)}' },
      { code: '${res.stats.ageGroupCount(3)}' },
      { code: '${res.stats.ageGroupCount(4)}' },
      { code: '${res.stats.ageGroupCount(5)}' },
      { code: '${res.stats.childCount}' },
      { code: '${rooms}' },
      { code: '${sum}' },
      { code: '${sumAmount?string("0.00")}' },
      { code: '${sumStr}' }
    ]
  },
  cancellation: {
    title: 'Cancellation / Void',
    items: [
      { code: '${voidDate}' },
      { code: '${voidIDs}' },
      { code: '${voidReason}' },
      { code: '${voidReasonText}' },
      { code: '${voidUser}' },
      { code: '${res.voidConditionDescriptions}' },
      { code: '${res.voidConditionNames}' }
    ]
  },
  policies: {
    title: 'Deposit & Cancellation Policies',
    items: [
      { code: '${singleDepositPolicy.shortDescription}' },
      { code: '${singleDepositPolicy.description}' },
      { code: '${singleDepositPolicy.type}' },
      { code: '${singleDepositPolicy.valueDescription}' },
      { code: '${singleDepositPolicy.amount.currencyStringWithSymbol}' },
      { code: '${singleDepositPolicy.amount.currencyString}' },
      { code: '${singleDepositPolicy.dueDate}' },
      { code: '${groupedDepositPolicy.shortDescription}' },
      { code: '${groupedDepositPolicy.description}' },
      { code: '${groupedDepositPolicy.type}' },
      { code: '${groupedDepositPolicy.valueDescription}' },
      { code: '${groupedDepositPolicy.amount.currencyStringWithSymbol}' },
      { code: '${groupedDepositPolicy.amount.currencyString}' },
      { code: '${groupedDepositPolicy.dueDate}' },
      { code: '${singleCancellationPolicy.shortDescription}' },
      { code: '${singleCancellationPolicy.description}' },
      { code: '${singleCancellationPolicy.type}' },
      { code: '${singleCancellationPolicy.valueDescription}' },
      { code: '${singleCancellationPolicy.amount.currencyStringWithSymbol}' },
      { code: '${singleCancellationPolicy.amount.currencyString}' },
      { code: '${singleCancellationPolicy.dueDate}' },
      { code: '${groupedCancellationPolicy.shortDescription}' },
      { code: '${groupedCancellationPolicy.description}' },
      { code: '${groupedCancellationPolicy.type}' },
      { code: '${groupedCancellationPolicy.valueDescription}' },
      { code: '${groupedCancellationPolicy.amount.currencyStringWithSymbol}' },
      { code: '${groupedCancellationPolicy.amount.currencyString}' },
      { code: '${groupedCancellationPolicy.dueDate}' }
    ]
  },
  paymentReminders: {
    title: 'Payment reminders & debts',
    items: [
      { code: '${debt.getDunningAmount().getCurrencyStringWithSymbol()}' },
      { code: '${debt.getOpenAmount().getCurrencyStringWithSymbol()}' },
      { code: '${dunAmount.getCurrencyStringWithSymbol()}' },
      { code: '${dunningDate}' }
    ]
  },
  items: {
    title: 'Invoice / Item level placeholders',
    items: [
      { code: '${item.cashPostingID}' },
      { code: '${item.cashPostingString}' },
      { code: '${item.customInvoiceDate}' },
      { code: '${item.guests}' },
      { code: '${item.invoiceText}' },
      { code: '${item.netAmount}' },
      { code: '${item.grossAmount}' },
      { code: '${item.room}' },
      { code: '${item.taxAmount}' },
      { code: '${item.taxPercentage}' }
    ]
  },
  genericExport: {
    title: 'Generic / Country specific exports',
    items: [
      { code: '${hotel.customerId}' },
      { code: '${guest.MiddleName}' },
      { code: '${guest.address.region}' },
      { code: '${guest.address.stateName}' },
      { code: '${revenue.totalRevenue}' },
      { code: '${revenue.totalLogisRevenue}' },
      { code: '${revenue.totalFoodAndBeverageRevenue}' }
    ]
  }
};

export const ALL_PLACEHOLDERS = Object.values(PLACEHOLDER_GROUPS).flatMap(g => g.items.map(i => i.code));

export default PLACEHOLDER_GROUPS;
