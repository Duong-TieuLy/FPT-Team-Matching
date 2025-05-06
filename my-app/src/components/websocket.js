import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
const API_PROJECT = import.meta.env.VITE_HOST;
const SOCKET_URL = `${API_PROJECT}/ws`; // điều chỉnh nếu khác

export default function useWebSocket(onMessageCallback, subscribeUrl) {
  const stompClient = useRef(null);

  useEffect(() => {
    const socket = new SockJS(SOCKET_URL);
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, () => {
      stompClient.current.subscribe(subscribeUrl, (message) => {
        const body = JSON.parse(message.body);
        onMessageCallback(body);
      });
    });

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect();
      }
    };
  }, [subscribeUrl]);

  const sendMessage = (destination, body) => {
    stompClient.current?.send(destination, {}, JSON.stringify(body));
  };

  return { sendMessage };
}
