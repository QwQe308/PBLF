const BASE_URL = "http://localhost:3000/api"; // 假设的后端地址

export interface Room {
  id: string;
  name: string;
  players: number;
}

export interface GameState {
  board: number[][]; // 0: empty, 1: black, 2: white
  turn: number; // 1 or 2
  winner: number | null;
}

async function request(endpoint: string, options?: RequestInit): Promise<any> {
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  return response.json();
}

export const GomokuApi = {
  async login(
    username: string,
    password: string
  ): Promise<"success" | "timeout" | "failed" | "noInput" | "tooLong"> {
    if(!username || !password){
      return "noInput"
    }

    if(username.length > 50 || password.length > 100){
      return "tooLong"
    }

    try {
      let response = await request("/wuziqi/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        if (response.code === undefined) {
          console.error(`登录失败: ${response.status} ${response.statusText}`);
          return "timeout";
        }else{
          return "failed"
        }
      } else {
        return "success"
      }
    } catch (err) {
      console.error(err)
    }
  },

  async register(
    username: string,
    password: string
  ): Promise<"success" | "failed"> {
    return request("/wuziqi/signup", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  async getRooms(): Promise<Room[]> {
    // 模拟返回一些房间
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: "101", name: "高手进", players: 1 },
          { id: "102", name: "新手场", players: 0 },
        ]);
      }, 500);
    });
  },

  async createRoom(name: string): Promise<{ roomId: string }> {
    return request("/rooms", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  async joinRoom(roomId: string): Promise<{ success: boolean }> {
    return request(`/rooms/${roomId}/join`, { method: "POST" });
  },

  async getGameState(roomId: string): Promise<GameState> {
    return request(`/rooms/${roomId}/game`, { method: "GET" });
  },

  async makeMove(roomId: string, x: number, y: number): Promise<void> {
    return request(`/rooms/${roomId}/move`, {
      method: "POST",
      body: JSON.stringify({ x, y }),
    });
  },
};
