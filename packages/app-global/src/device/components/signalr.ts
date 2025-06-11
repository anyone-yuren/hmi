import * as SignalR from '@microsoft/signalr';
export const createSinalRConnection = (url: string) => {
  return new SignalR.HubConnectionBuilder()
    .withUrl(url)
    .withAutomaticReconnect()
    .configureLogging(SignalR.LogLevel.Information)
    .build();
};
