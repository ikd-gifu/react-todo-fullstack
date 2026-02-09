// バックエンドとの通信設定のみ
// 状態を持たない関数
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// 設定済みクライアント」を作る部分
const apiClient = axios.create({
  baseURL: baseUrl,
  // JSON形式のデータをやり取りする設定 Content-Type を自動で付ける
});

export default apiClient;
