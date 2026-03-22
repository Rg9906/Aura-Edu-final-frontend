import { AuraEvent, AuraMetrics, AuraSession, SystemStatus } from "../domain/models";

export class MockDataService {
  static generateMockEvent(direction?: AuraEvent['direction']): AuraEvent {
    const directions: AuraEvent['direction'][] = [
      'front', 'front-right', 'right', 'back-right', 
      'back', 'back-left', 'left', 'front-left'
    ];
    
    const selectedDir = direction || directions[Math.floor(Math.random() * directions.length)];
    const distance = Math.floor(Math.random() * 200) + 20;
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      object: Math.random() > 0.5 ? 'Static Obstacle' : 'Moving Object',
      direction: selectedDir,
      distance,
      result: 'pending',
      urgency: distance < 50 ? 'high' : distance < 120 ? 'medium' : 'low'
    };
  }

  static getInitialStatus(): SystemStatus {
    return {
      isConnected: true,
      isStreaming: false,
      batteryLevel: 84,
      sensitivity: 85,
      mode: 'educational'
    };
  }

  static getInitialMetrics(): AuraMetrics {
    return {
      successRate: 98.2,
      failureRate: 1.8,
      averageReactionTime: 142,
      leftRightBalance: 0.05,
      sensEdScore: 88.4
    };
  }
}
