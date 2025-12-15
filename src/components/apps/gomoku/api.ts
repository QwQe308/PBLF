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
  color: undefined | -1 | 1;
}

async function request(endpoint: string, options?: RequestInit): Promise<any> {
  const token = Cookies.get("token");
  const headers = new Headers(options?.headers);

  if (token) {
    headers.set("token", token);
  }

  const credentials: RequestCredentials = "include";

  let params = "";
  if (options.body) {
    let body = JSON.parse(options.body as any);
    for (let i in body) {
      if (params === "") params = `?${i}=${body[i]}`;
      else params += `&${i}=${body[i]}`;
    }

    delete options.body;
  }
  const response = await fetch(`${BASE_URL}${endpoint}${params}`, {
    ...options,
    headers,
    credentials,
  });
  return response.json();
}

export const GomokuApi = {
  async login(
    username: string,
    password: string
  ): Promise<"success" | "failed" | "noInput" | "tooLong" | "error"> {
    if (!username || !password) {
      return "noInput";
    }

    if (username.length > 50 || password.length > 100) {
      return "tooLong";
    }

    try {
      const response = await request("/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (response.code === 1) {
        console.log(response, response.code, response.data);
        Cookies.set("token", response.data, { secure: false });
        console.log(Cookies.get("token"));
        return "success";
      } else {
        console.log(response);
        return "failed";
        /* alert("控制台捕获了一个错误! 请查看控制台!");
          console.error(`未知的服务器回复: `, response); */
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
  ): Promise<"success" | "failed" | "noInput" | "tooLong" | "error"> {
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

      if (response.code === 1) {
        return "success";
      } else {
        return "failed";
        /* alert("控制台捕获了一个错误! 请查看控制台!"); */
        /* console.error(`未知的服务器回复: `, response); */
      }
    } catch (err) {
      console.error(err);
      return "error";
    }
  },

  async getRooms(): Promise<"notLogin" | Room[]> {
    try {
      const response = await request("/room", { method: "GET" });
      if (response.code === 0) {
        return "notLogin";
      }
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
    } catch (err) {
      console.error(err);
    }
  },

  async createRoom(name: string): Promise<"failed" | Room> {
    try {
      const response = await request("/room/create", {
        method: "POST",
        body: JSON.stringify({ name }),
      });

      if (response.code === 0) {
        return "failed";
      }
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
    } catch (err) {
      console.error(err);
    }
  },

  async joinRoom(roomId: string): Promise<"failed" | "success"> {
    try {
      const response = await request(`/room/${roomId}`, { method: "PUT" });
      if (response.code === 0) {
        return "failed";
      }
      return "success";
    } catch (err) {
      console.error(err);
      return "failed";
    }
  },

  async getGameState(
    roomId: string,
    playerId: string
  ): Promise<"timeout" | "failed" | GameState> {
    try {
      const response = await request(`/game/info/${roomId}`, { method: "GET" });
      if (response.code === 1) {
        return {
          board: response.data.checkerboard,
          turn: response.data.nextPlayerId === playerId,
          status: response.data.status,
          winner:
            response.data.status === "FINISHED"
              ? undefined
              : response.winnerId === playerId,
          color: response.data.playerOneId === playerId ? -1 : 1,
        };
      } else return "failed";
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
