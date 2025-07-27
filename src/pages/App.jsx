import { useEffect, useState } from "react";

export default function App() {
  const [name, setName] = useState(localStorage.getItem("alqeem_name") || "");
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem("alqeem_tasks")) || []);
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [apiKey, setApiKey] = useState(localStorage.getItem("alqeem_api_key") || "");

  useEffect(() => {
    localStorage.setItem("alqeem_name", name);
    localStorage.setItem("alqeem_tasks", JSON.stringify(tasks));
    localStorage.setItem("alqeem_api_key", apiKey);
  }, [name, tasks, apiKey]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, task]);
      setTask("");
    }
  };

  const askAI = async () => {
    if (!aiInput.trim() || !apiKey) return;
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: aiInput }]
        })
      });
      const data = await response.json();
      setAiResponse(data.choices?.[0]?.message?.content || "Keine Antwort erhalten.");
    } catch (error) {
      setAiResponse("Fehler bei der AI-Abfrage.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🤖 Willkommen {name || "Nutzer"} – Alqeem, dein persönlicher Assistent</h1>
      <div>
        <input
          placeholder="Wie darf ich dich nennen?"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <h2>🔑 OpenAI API-Schlüssel</h2>
      <input
        placeholder="sk-..."
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        style={{ width: "300px" }}
      />

      <h2>🧠 Persönliche Beratung mit KI</h2>
      <textarea
        rows={3}
        placeholder="Was soll ich für dich herausfinden oder vorbereiten?"
        value={aiInput}
        onChange={(e) => setAiInput(e.target.value)}
        style={{ width: "100%", marginTop: "10px" }}
      />
      <button onClick={askAI} style={{ marginTop: "10px" }}>Frage stellen</button>
      {aiResponse && <div style={{ background: "#eef", padding: "10px", marginTop: "10px" }}>{aiResponse}</div>}

      <h2>📋 Aufgaben</h2>
      <input
        placeholder="Neue Aufgabe"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={addTask}>Hinzufügen</button>
      <ul>
        {tasks.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
