import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [audio, setAudio] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/articles");
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("加载文章失败：", error);
      }
    };
    fetchData();
  }, []);

  const playAudio = (track) => {
    if (audio) {
      audio.pause();
    }
    const newAudio = new Audio(track);
    newAudio.loop = true;
    newAudio.play();
    setAudio(newAudio);
    setCurrentTrack(track);
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">沉音书阁</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article) => (
          <Card key={article.id} onClick={() => playAudio(article.bgm)} className="cursor-pointer">
            <img src={article.cover} alt={article.title} className="w-full h-48 object-cover rounded-t-xl" />
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              <div className="text-sm text-gray-500">{article.tags?.join(", ")}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {currentTrack && (
        <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg p-2 flex items-center gap-2">
          <span className="text-sm font-medium">🎧 正在播放</span>
          <button
            className="text-blue-500 underline"
            onClick={() => {
              audio.pause();
              setCurrentTrack(null);
            }}
          >
            停止
          </button>
        </div>
      )}
    </main>
  );
}