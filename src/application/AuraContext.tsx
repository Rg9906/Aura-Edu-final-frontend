import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AuraEvent, AuraMetrics, AuraSession, SystemStatus } from '../domain/models';
import { MockDataService } from '../data/mockService';
import { auth, db } from '../firebase';
import { GeminiService } from '../services/geminiService';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  addDoc,
  serverTimestamp,
  updateDoc,
  getDoc
} from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface Message {
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface AuraContextType {
  status: SystemStatus;
  metrics: AuraMetrics;
  currentEvents: AuraEvent[];
  sessions: AuraSession[];
  toggleSystem: () => void;
  setSensitivity: (val: number) => void;
  addEvent: (event: AuraEvent) => void;
  login: (username: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  user: UserProfile | null;
  logout: () => Promise<void>;
  isAuthReady: boolean;
  messages: Message[];
  sendMessage: (text: string) => Promise<void>;
}

const AuraContext = createContext<AuraContextType | null>(null);

export const AuraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(true);
  const [status, setStatus] = useState<SystemStatus>(MockDataService.getInitialStatus());
  const [metrics, setMetrics] = useState<AuraMetrics>(MockDataService.getInitialMetrics());
  const [currentEvents, setCurrentEvents] = useState<AuraEvent[]>([]);
  const [sessions, setSessions] = useState<AuraSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "HEY THERE, CHAMP! 🌟 Ready to crush today's recovery? I've been looking at your stats and you are absolutely killing it! Your focus is up 15% this morning—that's what I'm talking about! Let's get those eyes moving and that brain grooving. What's on your mind today?", timestamp: Date.now() }
  ]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  const geminiRef = useRef<GeminiService | null>(null);

  useEffect(() => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      geminiRef.current = new GeminiService(apiKey);
    }
  }, []);

  useEffect(() => {
    // Check local storage for session
    const savedUser = localStorage.getItem('aura_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setSessions([]);
      return;
    }

    // Still use Firestore for sessions if possible, but scoped to the mock user ID
    const sessionsPath = 'sessions';
    const q = query(
      collection(db, sessionsPath),
      where('userId', '==', user.uid),
      orderBy('startTime', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessionData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          startTime: (data.startTime as Timestamp).toMillis(),
          endTime: data.endTime ? (data.endTime as Timestamp).toMillis() : undefined,
          duration: data.endTime ? (data.endTime as Timestamp).seconds - (data.startTime as Timestamp).seconds : 0,
          events: [], 
          successRate: data.successRate || 0
        } as AuraSession;
      });
      setSessions(sessionData);
    }, (error) => {
      // Silently fail if firestore is not ready or permissions fail for mock user
      console.warn('Firestore sessions fetch failed:', error.message);
    });

    return () => unsubscribe();
  }, [user]);

  const login = async (username: string, pass: string) => {
    if (username === 'Junghyeok_Yu' && pass === 'Thefoolswhodream') {
      const mockUser: UserProfile = {
        uid: 'mock_user_123',
        email: 'junghyeok.yu@aura.edu',
        displayName: 'Junghyeok Yu'
      };
      setUser(mockUser);
      localStorage.setItem('aura_user', JSON.stringify(mockUser));
    } else {
      throw new Error('wrong user name or password');
    }
  };

  const register = async (email: string, pass: string) => {
    // Disabled for now as per user request
    throw new Error('Registration is currently disabled.');
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('aura_user');
  };

  const signInWithGoogle = async () => {
    // Disabled for now as per user request
    throw new Error('Google Sign-In is currently disabled.');
  };

  const toggleSystem = async () => {
    const newStreamingState = !status.isStreaming;
    setStatus(prev => ({ ...prev, isStreaming: newStreamingState }));

    if (user && newStreamingState) {
      // Start new session
      try {
        const sessionRef = await addDoc(collection(db, 'sessions'), {
          userId: user.uid,
          startTime: serverTimestamp(),
          sensEdScore: metrics.sensEdScore,
          successRate: metrics.successRate
        });
        setCurrentSessionId(sessionRef.id);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'sessions');
      }
    } else if (user && !newStreamingState && currentSessionId) {
      // End current session
      try {
        await updateDoc(doc(db, 'sessions', currentSessionId), {
          endTime: serverTimestamp(),
          sensEdScore: metrics.sensEdScore,
          successRate: metrics.successRate
        });
        setCurrentSessionId(null);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `sessions/${currentSessionId}`);
      }
    }
  };

  const setSensitivity = async (val: number) => {
    setStatus(prev => ({ ...prev, sensitivity: val }));
    if (user) {
      const userPath = `users/${user.uid}`;
      try {
        await setDoc(doc(db, userPath), { sensitivity: val }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, userPath);
      }
    }
  };

  const addEvent = useCallback(async (event: AuraEvent) => {
    setCurrentEvents(prev => [event, ...prev].slice(0, 10));
    setMetrics(prev => ({
      ...prev,
      sensEdScore: Math.min(100, prev.sensEdScore + (event.result === 'success' ? 0.1 : -0.5))
    }));

    if (user && currentSessionId) {
      const eventPath = `sessions/${currentSessionId}/events`;
      try {
        await addDoc(collection(db, eventPath), {
          id: event.id,
          sessionId: currentSessionId,
          userId: user.uid,
          type: event.urgency === 'high' ? 'warning' : 'obstacle',
          direction: event.direction,
          urgency: event.urgency === 'high' ? 5 : event.urgency === 'medium' ? 3 : 1,
          timestamp: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, eventPath);
      }
    }
  }, [user, currentSessionId, metrics.sensEdScore, metrics.successRate]);

  const sendMessage = async (text: string) => {
    const userMessage: Message = { role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);

    if (geminiRef.current) {
      const context = `Current SENS-ED: ${metrics.sensEdScore.toFixed(1)}, Success Rate: ${(metrics.successRate * 100).toFixed(0)}%, Battery: ${status.batteryLevel}%.`;
      const aiResponse = await geminiRef.current.generateResponse(text, context);
      const aiMessage: Message = { role: 'ai', text: aiResponse, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMessage]);
    } else {
      setTimeout(() => {
        const aiMessage: Message = { role: 'ai', text: "AI Assistant is currently offline. Please check your API key configuration.", timestamp: Date.now() };
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
    }
  };

  // Real-time loop simulation
  useEffect(() => {
    if (!status.isStreaming) return;

    const interval = setInterval(() => {
      const newEvent = MockDataService.generateMockEvent();
      setTimeout(() => {
        const success = Math.random() > 0.1;
        const processedEvent: AuraEvent = {
          ...newEvent,
          result: success ? 'success' : 'failure',
          reactionTime: Math.floor(Math.random() * 200) + 100
        };
        addEvent(processedEvent);
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, [status.isStreaming, addEvent]);

  return (
    <AuraContext.Provider value={{
      status, metrics, currentEvents, sessions,
      toggleSystem, setSensitivity, addEvent,
      login, register, signInWithGoogle, user, logout, isAuthReady,
      messages, sendMessage
    }}>
      {children}
    </AuraContext.Provider>
  );
};

export const useAura = () => {
  const context = useContext(AuraContext);
  if (!context) throw new Error('useAura must be used within AuraProvider');
  return context;
};
