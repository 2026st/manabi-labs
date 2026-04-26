import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addStudySite } from "../lib/study-sites";

export default function StudyNewRoute() {
  const navigate = useNavigate();
  const [siteLabel, setSiteLabel] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [error, setError] = useState("");

  function onSave() {
    const ok = addStudySite({ label: siteLabel, url: siteUrl });
    if (!ok) {
      setError("サイト名と有効なURLを入力してください");
      return;
    }
    navigate("/study");
  }

  return (
    <section className="paper-body form-stack">
      <h2>勉強サイトを追加</h2>
      <input
        className="input input--compact"
        value={siteLabel}
        onChange={(event) => setSiteLabel(event.target.value)}
        placeholder="サイト名を入力"
        maxLength={80}
      />
      <input
        className="input input--compact"
        value={siteUrl}
        onChange={(event) => setSiteUrl(event.target.value)}
        placeholder="URLを入力 (例: https://example.com)"
        maxLength={500}
      />
      {error ? <p className="notice notice--error">{error}</p> : null}
      <div className="row-2">
        <button type="button" className="btn btn--primary" onClick={onSave}>
          追加する
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => navigate(-1)}>
          キャンセル
        </button>
      </div>
    </section>
  );
}
