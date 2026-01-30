export interface InternalMouthlyQueryParams {
    year: number;
}

export interface MonthlyBucketDetailItem {
    name: string;
    count: number;
    total: number;
}

export interface MonthlyDetailBreakdown {
    startDate: string;
    endDate: string;
    total: number;
    totalInternal: number;
    totalResell: number;
    internal: MonthlyBucketDetailItem[];
    resell: MonthlyBucketDetailItem[];
}

export interface InternalMonthlyData {
    month: string;
    detail: MonthlyDetailBreakdown[];
    total: number;
}

export interface InternalMouthlyResponseData {
    success: boolean;
    message: string;
    data: {
        total: number;
        totalInternal: number;
        totalResell: number;
        data: InternalMonthlyData[];
    };
}


export interface InvoiceQueryParams {
    employeeId: string;
    startDate: string;
    endDate: string;
}

export interface InvoiceResponseData {
    success: boolean;
    message: string;
    data: {
        total: number;
        solo: {
            data: InvoiceData[];
            total: number;
        }
        booster: {
            data: InvoiceData[];
            total: number;
        }
        recurring: {
            data: InvoiceData[];
            total: number;
        }
    };
}

export interface InvoiceData {
    ai: number;
    invoiceNumber: number;
    invoiceDate: string;
    dpp: number;
    customerServiceId: number;
    customerId: string;
    customerCompany: string;
    customerGroupId: string;
    serviceId: string;
    serviceName: string;
    salesId: string;
    managerSalesId: string;
    implementatorId: string;
    referralId: string;
    isNew: boolean;
    isUpgrade: boolean;
    isTermin: boolean;
    salesCommission: number;
    salesCommissionPercentage: number;
}

