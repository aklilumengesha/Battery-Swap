/**
 * WebSocket Service
 * Modular WebSocket connection management for real-time updates
 */

import { config } from "../../common/config";

export interface StationUpdate {
  type: string;
  station_id: number | string;
  station_name?: string;
  available_batteries?: number;
  booked_batteries?: number;
  total_batteries?: number;
  timestamp?: string;
  action?: string;
}

export type WebSocketMessageHandler = (data: StationUpdate) => void;

/**
 * Get WebSocket URL from API URL
 * Converts http://localhost:8000 to ws://localhost:8000
 * Converts https://domain.com to wss://domain.com
 */
const getWebSocketUrl = (path: string): string => {
  const apiUrl = config.API_URL;
  const wsProtocol = apiUrl.startsWith("https") ? "wss" : "ws";
  const baseUrl = apiUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `${wsProtocol}://${baseUrl}${path}`;
};

/**
 * WebSocket Connection Manager
 * Handles connection lifecycle, reconnection, and message routing
 */
export class WebSocketManager {
  private ws: WebSocket | null = null;
  private url: string;
  private handlers: Set<WebSocketMessageHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isIntentionallyClosed = false;

  constructor(path: string) {
    this.url = getWebSocketUrl(path);
  }

  /**
   * Connect to WebSocket
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isIntentionallyClosed = false;
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log(`[WebSocket] Connected to ${this.url}`);
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data: StationUpdate = JSON.parse(event.data);
        this.handlers.forEach((handler) => {
          if (typeof handler === 'function') {
            handler(data);
          } else {
            console.error("[WebSocket] Handler is not a function:", handler);
          }
        });
      } catch (error) {
        console.error("[WebSocket] Failed to parse message:", error);
      }
    };

    this.ws.onerror = (error) => {
      console.error("[WebSocket] Error:", error);
    };

    this.ws.onclose = () => {
      console.log("[WebSocket] Disconnected");
      this.ws = null;

      // Attempt reconnection if not intentionally closed
      if (!this.isIntentionallyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
        setTimeout(() => this.connect(), delay);
      }
    };
  }

  /**
   * Subscribe to WebSocket messages
   */
  subscribe(handler: WebSocketMessageHandler): () => void {
    this.handlers.add(handler);
    
    // Return unsubscribe function
    return () => {
      this.handlers.delete(handler);
    };
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    this.isIntentionallyClosed = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.handlers.clear();
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

/**
 * Create WebSocket manager for all stations
 */
export const createAllStationsWebSocket = (): WebSocketManager => {
  return new WebSocketManager("/ws/stations/");
};

/**
 * Create WebSocket manager for specific station
 */
export const createStationWebSocket = (stationId: string | number): WebSocketManager => {
  return new WebSocketManager(`/ws/stations/${stationId}/`);
};
