/**
 * useStationWebSocket Hook
 * React hook for real-time station availability updates via WebSocket
 */

import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  createAllStationsWebSocket,
  WebSocketManager,
  StationUpdate,
} from "../../../services/websocket.service";
import { Station } from "../store/stationsSlice";

interface UseStationWebSocketOptions {
  enabled?: boolean;
  onUpdate?: (update: StationUpdate) => void;
}

/**
 * Hook to connect to station availability WebSocket
 * Automatically updates React Query cache when availability changes
 */
export const useStationWebSocket = (options: UseStationWebSocketOptions = {}) => {
  const { enabled = true, onUpdate } = options;
  const queryClient = useQueryClient();
  const wsManagerRef = useRef<WebSocketManager | null>(null);

  const handleStationUpdate = useCallback(
    (data: StationUpdate) => {
      // Call custom handler if provided
      if (onUpdate) {
        onUpdate(data);
      }

      // Update React Query cache for nearby stations
      queryClient.setQueryData<Station[]>(
        ["stations", "nearby"],
        (oldData) => {
          if (!oldData) return oldData;

          return oldData.map((station) => {
            if (station.pk === data.station_id) {
              return {
                ...station,
                available_batteries: data.available_batteries ?? station.available_batteries,
              };
            }
            return station;
          });
        }
      );

      // Update React Query cache for specific station if it exists
      queryClient.setQueryData<Station>(
        ["station", String(data.station_id)],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            available_batteries: data.available_batteries ?? oldData.available_batteries,
          };
        }
      );
    },
    [queryClient, onUpdate]
  );

  useEffect(() => {
    if (!enabled) return;

    // Create WebSocket manager
    wsManagerRef.current = createAllStationsWebSocket();

    // Subscribe to updates
    const unsubscribe = wsManagerRef.current.subscribe(handleStationUpdate);

    // Connect
    wsManagerRef.current.connect();

    // Cleanup on unmount
    return () => {
      unsubscribe();
      wsManagerRef.current?.disconnect();
      wsManagerRef.current = null;
    };
  }, [enabled, handleStationUpdate]);

  return {
    isConnected: wsManagerRef.current?.isConnected() ?? false,
  };
};
