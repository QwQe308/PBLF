import Cookies from "js-cookie";

const BASE_URL = "/wuziqi";

export interface Room {
  id: string;
  name: string;
  players: number;
  status: "WAITING" | "PROCEEDING" | "FINISHED";
}

export interface GameState {
  board: number[][];
  turn: boolean;
  status: "WAITING" | "PROCEEDING" | "FINISHED";
  winner: undefined | boolean;
}

async function request(endpoint: string, options?: RequestInit): Promise<any> {
  options.credentials = "include";
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  return response.json();
}

export const GomokuApi = {
  async login(
    username: string,
    password: string
  ): Promise<
    "success" | "timeout" | "failed" | "noInput" | "tooLong" | "error"
  > {
    if (!username || !password) {
      return "noInput";
    }

    if (username.length > 50 || password.length > 100) {
      return "tooLong";
    }

    try {
      let response = await request("/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        if (response.code === undefined) {
          console.error(`登录失败: ${response.status} ${response.statusText}`);
          return "timeout";
        } else {
          return "failed";
        }
      } else {
        if (response.success) {
          Cookies.set("token", response.data);
          return "success";
        } else {
          alert("控制台捕获了一个错误! 请查看控制台!");
          console.error(`未知的服务器回复: `, response);
        }
      }
    } catch (err) {
      console.error(err);
      return "error";
    }
  },

  async logout() {
    Cookies.remove("token");
  },

  async register(
    username: string,
    password: string
  ): Promise<
    "success" | "failed" | "timeout" | "noInput" | "tooLong" | "error"
  > {
    if (!username || !password) {
      return "noInput";
    }

    if (username.length > 50 || password.length > 100) {
      return "tooLong";
    }

    try {
      let response = await request("/signup", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        if (response.code === undefined) {
          console.error(`注册失败: ${response.status} ${response.statusText}`);
          return "timeout";
        } else {
          return "failed";
        }
      } else {
        if (response.success) {
          return "success";
        } else {
          alert("控制台捕获了一个错误! 请查看控制台!");
          console.error(`未知的服务器回复: `, response);
        }
      }
    } catch (err) {
      console.error(err);
      return "error";
    }
  },

  async getRooms(): Promise<"notLogin" | "timeout" | Room[]> {
    try {
      const response = await request("/room", { method: "GET" });
      if (!response.ok) {
        if (response.code === undefined) {
          return "timeout";
        } else {
          return "notLogin";
        }
      } else {
        return response.data.map((roomData: any) => {
          return {
            id: roomData.id,
            name: roomData.name,
            players:
              (roomData.playerOneId === null ? 0 : 1) +
              (roomData.playerTwoId === null ? 0 : 1),
            status: roomData.status,
          };
        });
      }
    } catch (err) {
      console.error(err);
    }
  },

  async createRoom(name: string): Promise<"notLogin" | "timeout" | Room> {
    try {
      const response = await request("/room/create", {
        method: "POST",
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        if (response.code === undefined) {
          return "timeout";
        } else {
          return "notLogin";
        }
      } else {
        return response.data.map((roomData: any) => {
          return {
            id: roomData.id,
            name: roomData.name,
            players:
              (roomData.playerOneId === null ? 0 : 1) +
              (roomData.playerTwoId === null ? 0 : 1),
            status: roomData.status,
          };
        });
      }
    } catch (err) {
      console.error(err);
    }
  },

  async joinRoom(
    roomId: string
  ): Promise<"notLogin" | "timeout" | "failed" | "success"> {
    try {
      const response = await request(`/room/${roomId}`, { method: "PUT" });
      if (!response.ok) {
        if (response.code === undefined) {
          return "timeout";
        } else {
          return "notLogin";
        }
      } else {
        if (response.code === 1) return "success";
        else return "failed";
      }
    } catch (err) {
      console.error(err);
      return "failed";
    }
  },

  async getGameState(
    roomId: string,
    playerId: string
  ): Promise<"notLogin" | "timeout" | "failed" | GameState> {
    try {
      const response = await request(`/game/info/${roomId}`, { method: "GET" });
      if (!response.ok) {
        if (response.code === undefined) {
          return "timeout";
        } else {
          return "notLogin";
        }
      } else {
        if (response.code === 1) {
          return {
            board: response.data.checkerboard,
            turn: response.data.nextPlayerId === playerId,
            status: response.data.status,
            winner:
              response.data.status === "FINISHED"
                ? undefined
                : response.winnerId === playerId,
          };
        } else return "failed";
      }
    } catch (err) {
      console.error(err);
    }
  },

  async makeMove(roomId: string, x: number, y: number): Promise<void> {
    return request(`/rooms/${roomId}/move`, {
      method: "POST",
      body: JSON.stringify({ x, y }),
    });
  },
};
