export class Alert {
    email: string;
    userId: string;
    deviceId: string; // You may want to change the type as needed
    min: number;
    max: number;
    status: string;
    data: string;
    Nsms: boolean;
    Nemail: boolean;
    Ntoast: boolean;
    deviceName: string;
}