module Api
  module V1
    class TodosController < ApplicationController
      def index
        todos = Todo.all
        render json: todos.map { |todo| serialize_todo(todo) }
      end

      private

      # レスポンスをcamelCase 変換
      def serialize_todo(todo)
        {
          id: todo.id,
          title: todo.title,
          content: todo.content,
          createdAt: todo.created_at&.iso8601,
          updatedAt: todo.updated_at&.iso8601
        }
      end
    end
  end
end
