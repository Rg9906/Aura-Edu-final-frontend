export interface AuraEvent {
  id: string;
  timestamp: number;
  object: string;
  direction: 'front' | 'front-right' | 'right' | 'back-right' | 'back' | 'back-left' | 'left' | 'front-left';
  distance: number; // in cm
  reactionTime?: number; // in ms
  result: 'success' | 'failure' | 'pending';
  urgency: 'low' | 'medium' | 'high';
}

export interface AuraSession {
  id: string;
  startTime: number;
  endTime?: number;
  duration: number; // in seconds
  events: AuraEvent[];
  successRate: number;
}

export interface AuraMetrics {
  successRate: number;
  failureRate: number;
  averageReactionTime: number;
  leftRightBalance: number; // -1 to 1 (left to right)
  sensEdScore: number; // 0 to 100
}

export interface SystemStatus {
  isConnected: boolean;
  isStreaming: boolean;
  batteryLevel: number;
  sensitivity: number;
  mode: 'professional' | 'educational' | 'diagnostic';
}
