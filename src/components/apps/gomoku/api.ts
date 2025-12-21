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
  lastMove: [number, number];
}

async function request(endpoint: string, options?: RequestInit): Promise<any> {
  const token = Cookies.get("token");
  const headers = new Headers(options?.headers);

  if (token) {
    headers.set("token", token);
  }
  headers.set("Content-Type", "application/json");

  const credentials: RequestCredentials = "include";

  /* let params = "";
  if (options.body) {
    let body = JSON.parse(options.body as any);
    for (let i in body) {
      if (params === "") params = `?${i}=${body[i]}`;
      else params += `&${i}=${body[i]}`;
    }
  } */
  const response = await fetch(`${BASE_URL}${endpoint}`, {
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

      if (response.code === 200) {
        Cookies.set("token", response.data, { secure: false });
        return "success";
      } else {
        console.log(response);
        return "failed";
      }
    } catch (err) {
      console.error(err);
      return "error";
    }
  },

  async getProfile(): Promise<string>{
    try{
      const response = await request("/user/info", {
        method: "GET"
      })

      return response.data.id
    }catch(err){
      console.log(err)
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

      if (response.code === 200) {
        return "success";
      } else {
        return "failed";
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

      if (response.code !== 200) {
        return "failed";
      }

      return {
        id: response.data.id,
        name: response.data.name,
        players:
          (response.data.playerOneId === null ? 0 : 1) +
          (response.data.playerTwoId === null ? 0 : 1),
        status: response.data.status,
      };
    } catch (err) {
      console.error(err);
      return "failed";
    }
  },

  async joinRoom(roomId: string): Promise<"failed" | "success"> {
    try {
      const response = await request(`/room/join/${roomId}`, { method: "PUT" });
      if (response.code !== 200) {
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
      const response = await request(`/room/info/${roomId}`, { method: "GET" });
      if (response.code === 200) {
        const RoomResponse = response.data.roomResponse
        const StepResponse = response.data.stepResponse
        return {
          board: RoomResponse.checkerboard,
          turn: RoomResponse.nextPlayerId === playerId,
          status: RoomResponse.status,
          winner:
            RoomResponse.status === "FINISHED"
              ? RoomResponse.winnerId === playerId
              : undefined,
          color: RoomResponse.playerOneId === playerId ? -1 : 1,
          lastMove: StepResponse === null ? [StepResponse.row, StepResponse.column] : null
        };
      } else return "failed";
    } catch (err) {
      console.error(err);
    }
  },

  async makeMove(roomId: string, x: number, y: number): Promise<void> {
    return request(`/game/move`, {
      method: "POST",
      body: JSON.stringify({ roomId: roomId, row: x, column: y }),
    });
  },
};
