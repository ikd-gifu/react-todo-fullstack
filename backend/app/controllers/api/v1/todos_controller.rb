module Api
  module V1
    class TodosController < ApplicationController
      def index
        todos = Todo.all
        render json: todos.map { |todo| serialize_todo(todo) }
      end

      def create
        todo = Todo.new(todo_params)
        if todo.save
          render json: serialize_todo(todo), status: :created
        else
          render json: { errors: todo.errors.full_messages }, status: :unprocessable_entity
        end
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

      def todo_params
        params.require(:todo).permit(:title, :content)
      end
    end
  end
end
