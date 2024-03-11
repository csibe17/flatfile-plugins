export const MERGE_ACCESS_KEY = 'MERGE_ACCESS_KEY'
export const MAX_SYNC_ATTEMPTS = 30 // Thirty cycles is equates to approx. 5 minutes
export const SYNC_RETRY_INTERVAL_MS = 10_000 // 10 seconds
export const CATEGORY_MODELS = {
  accounting: {
    Account: 'accounts',
    Address: 'addresses',
    Attachment: 'attachments',
    BalanceSheet: 'balanceSheets',
    CashFlowStatement: 'cashFlowStatements',
    CompanyInfo: 'companyInfo',
    CreditNote: 'creditNotes',
    Expense: 'expenses',
    IncomeStatement: 'incomeStatements',
    Invoice: 'invoices',
    Item: 'items',
    JournalEntry: 'journalEntries',
    Payment: 'payments',
    PhoneNumber: 'phoneNumbers',
    PurchaseOrder: 'purchaseOrders',
    TaxRate: 'taxRates',
    TrackingCategory: 'trackingCategories',
    Transaction: 'transactions',
    VendorCredit: 'vendorCredits',
  },
  ats: {
    Activity: 'activities',
    Application: 'applications',
    Attachment: 'attachments',
    Candidate: 'candidates',
    Department: 'departments',
    EEOC: 'eeocs',
    ScheduledInterview: 'interviews',
    JobInterviewStage: 'jobInterviewStages',
    Job: 'jobs',
    Offer: 'offers',
    Office: 'offices',
    RejectReason: 'rejectReasons',
    Scorecard: 'scorecards',
    ScreeningQuestion: 'screeningQuestions',
    Tag: 'tags',
    RemoteUser: 'users',
  },
  crm: {
    Account: 'accounts',
    Contact: 'contacts',
    EngagementType: 'engagementTypes',
    Engagement: 'engagements',
    Lead: 'leads',
    Note: 'notes',
    Opportunity: 'opportunities',
    Stage: 'stages',
    Task: 'tasks',
    User: 'users',
  },
  filestorage: {
    Drive: 'drives',
    File: 'files',
    Folder: 'folders',
    Group: 'groups',
    User: 'users',
  },
  hris: {
    BankInfo: 'bankInfo',
    Benefit: 'benefits',
    Company: 'companies',
    Dependent: 'dependents',
    EmployeePayrollRun: 'employeePayrollRuns',
    Employee: 'employees',
    EmployerBenefit: 'employerBenefits',
    Employment: 'employments',
    Group: 'groups',
    Location: 'locations',
    PayGroup: 'payGroups',
    PayrollRun: 'payrollRuns',
    TimeOff: 'timeOff',
    TimeOffBalance: 'timeOffBalances',
  },
  mktg: {
    Action: 'actions',
    Automation: 'automations',
    Campaign: 'campaigns',
    Contact: 'contacts',
    MarketingEmail: 'marketingEmails',
    Event: 'events',
    List: 'lists',
    Message: 'messages',
    Template: 'templates',
    User: 'users',
  },
  ticketing: {
    Ticket: 'tickets',
    Comment: 'comments',
    Attachment: 'attachments',
    Collection: 'collections',
    Issue: 'issues',
    Project: 'projects',
    Team: 'teams',
    User: 'users',
    Tag: 'tags',
  },
}
