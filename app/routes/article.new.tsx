import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createArticle } from "../lib/supabase.server";

export default function ArticleNewRoute() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  async function onSave() {
    if (!title.trim() || !body.trim()) return;
    const id = await createArticle({
      category: "articles",
      title: title.trim(),
      body: body.trim()
    });
    if (id) navigate(`/article/${id}`);
  }

  return (
    <section className="paper-body form-stack">
      <input
        className="input"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="タイトルを入力してください"
        maxLength={80}
      />
      <textarea
        className="textarea"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="記事の本文を入力してください..."
        maxLength={12000}
      />
      <div className="row-2">
        <button type="button" className="btn btn--primary" onClick={onSave}>
          保存する
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => navigate(-1)}>
          キャンセル
        </button>
      </div>
    </section>
  );
}
