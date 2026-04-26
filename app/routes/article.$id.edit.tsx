import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArticle, updateArticle } from "../lib/supabase.server";

export default function ArticleEditRoute() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (!id) return;
    void getArticle(id).then((item) => {
      if (!item) return;
      setTitle(item.title);
      setBody(item.body.replace(/^#\s.*\n\n?/, ""));
    });
  }, [id]);

  async function onSave() {
    if (!id || !title.trim() || !body.trim()) return;
    const ok = await updateArticle(id, { title: title.trim(), body: body.trim() });
    if (ok) navigate(`/article/${id}`);
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
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => navigate(`/article/${id}`)}
        >
          キャンセル
        </button>
      </div>
    </section>
  );
}
