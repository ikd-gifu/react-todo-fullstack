import { useMemo, useState, useEffect, useCallback } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { getTodos } from "../../../apis/todoCrud";
import { TodoType } from "../../../types/Todo";

// defaultValuesで""を使うため、string型で定義 optionalは不要
// react-hook-formはフィールド名で値を紐づけるため、
// schemaのキーはdefaultValues・Controllerのnameは
// 同じキー（search）で揃える必要がある
const SearchFormSchema = z.object({
  search: z.string(),
});

type SearchFormFormValue = z.infer<typeof SearchFormSchema>;

/**
 * TodoTemplateのページ固有UI状態管理
 * 検索機能など、表示・操作に関わる一時的な状態を管理
 * ページを離れたら破棄される状態のみを扱う
 */
export const useTodoTemplate = () => {
  // 型推論が機能: originalTodoListがArray<TodoType>と正しく推論される
  const [originalTodoList, setOriginalTodoList] = useState<Array<TodoType>>([]);

  // useEffectを副作用（API呼び出し）の再実行を防ぐためにuseCallbackでラップ
  const fetchTodos = useCallback(async () => {
    try {
      const res = await getTodos();
      if (!res.data) {
        console.error(res.message || "No data received");
        return;
      }

      setOriginalTodoList(res.data);

      // バックエンドに移行予定
      // const maxId = res.data.reduce((max, todo) => Math.max(max, todo.id), 0);
      // setUniqueId(maxId);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  }, []);

  useEffect(() => {
    fetchTodos(); // 関数を実行する エラーはIDの採番をバックエンドに移行することで解消
  }, [fetchTodos]); // 「関数そのもの（参照）」を渡している。関数を監視

  const {
    control,
  } = useForm<SearchFormFormValue>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      search: "",
    },
  });

  const searchInputValue = useWatch({ control, name: "search" }) ?? "";

  const handleDeleteTodo = useCallback(
  (targetId: number, targetTitle: string) => {
    // 確認ダイアログを表示
    if (window.confirm(`「${targetTitle}」を削除しますか？`)) {
      // 削除対象のID以外のTodoだけを残す
      const newTodoList = originalTodoList.filter((todo) => todo.id !== targetId);
      
      // 状態を更新
      setOriginalTodoList(newTodoList);
    }
  }, [originalTodoList]);

  // 検索キーワードに基づいて表示するTodoリストを絞り込む
  // useMemoで派生状態を最適化
  const showTodoList = useMemo(() => {
    return originalTodoList.filter((todo) =>
      // 検索キーワードに前方一致したTodoだけを一覧表示
      todo.title.toLowerCase().startsWith(searchInputValue.toLowerCase())
    );
    // originalTodoListかsearchInputValueが変化したときに再計算
  }, [originalTodoList, searchInputValue]);

  return {
    control,
    showTodoList,
    handleDeleteTodo,
  };
};
