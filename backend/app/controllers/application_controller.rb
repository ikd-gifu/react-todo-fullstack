class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound do |exception|
    render json: {
      errors: [
        {
          status: "404",
          title: "Not Found",
          detail: exception.message,
          code: "not_found"
        }
      ]
    }, status: :not_found
  end

  rescue_from StandardError do |exception|
    # 本番は固定メッセージ、開発/テストのみ詳細を返す
    detail =
      if Rails.env.production?
        "internal server error"
      else
        exception.message
      end

    render json: {
      errors: [
        {
          status: "500",
          title: "Internal Server Error",
          detail: detail,
          code: "internal_error"
        }
      ]
    }, status: :internal_server_error
  end
end
