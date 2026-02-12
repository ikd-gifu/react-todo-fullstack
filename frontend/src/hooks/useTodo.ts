import { useState, useCallback } from "react";
import { TodoType } from "../types/Todo";

/**
 * Todoのグローバル状態管理とCRUD操作
 * データの永続化に関わる処理のみを担当
 * Single Source of Truthとしてデータモデルを管理
 */
export const useTodo = () => {
  // todo listの状態管理
  // const [現在の値, 値を更新するための関数] = useState(初期値);
  const [originalTodoList, setOriginalTodoList] = useState<Array<TodoType>>([]);

  // Todo削除処理 @param は /**  */ のJSDocコメント内で使う
  /**
  * @param {number} targetId - 削除対象のTodoのID
  * @param {string} targetTitle - 削除対象のTodoのタイトル
  */
  const handleDeleteTodo = useCallback(
    (targetId: number, targetTitle: string) => {
      // 確認ダイアログを表示
      if (window.confirm(`「${targetTitle}」を削除しますか？`)) {
        // 削除対象のID以外のTodoだけを残す
        const newTodoList = originalTodoList.filter((todo) => todo.id !== targetId);
        
        // 状態を更新
        setOriginalTodoList(newTodoList); // backendに移行予定
      }
    }, [originalTodoList]);

  /**
   * Todo更新処理
   * @param {number} targetId - 更新対象のTodoのID
   * @param {string} title - 新しいタイトル
   * @param {string} content - 新しい内容
   */
  const handleUpdateTodo = useCallback(
      (targetId: number, title: string, content: string) => {
      const newTodoList = originalTodoList.map((todo) =>
        todo.id === targetId
          ? { ...todo, title, content }
          : todo
      );
      setOriginalTodoList(newTodoList); // backendに移行予定
    }, [originalTodoList]);

  return {
    originalTodoList, // データソース
    handleDeleteTodo, // 削除処理
    handleUpdateTodo, // 更新処理
  };
};
