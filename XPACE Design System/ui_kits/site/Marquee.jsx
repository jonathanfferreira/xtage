function Marquee() {
  const phrases = ["Mova-se Além", "Dance Company", "Joinville · SC", "Desde 2018", "FIH2 Finalistas", "Hip Hop · K-Pop · Jazz Funk", "Educação Premium"];
  const dotColors = ["#6324b2","#eb00bc","#ff5200","#ffd700"];
  const items = [...phrases, ...phrases, ...phrases];
  return (
    <div style={{background:"#050505",borderTop:"1px solid #1f1f1f",borderBottom:"1px solid #1f1f1f",padding:"24px 0",overflow:"hidden",position:"relative"}}>
      <div style={{display:"flex",gap:40,animation:"xpScroll 30s linear infinite",whiteSpace:"nowrap"}}>
        {items.map((p, i) => (
          <span key={i} style={{display:"inline-flex",alignItems:"center",gap:40,fontFamily:"var(--xp-font-tech)",fontWeight:700,fontSize:24,letterSpacing:"0.18em",textTransform:"uppercase",color:"#fff"}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:dotColors[i % dotColors.length]}}/>
            {p}
          </span>
        ))}
      </div>
      <style>{`@keyframes xpScroll{from{transform:translateX(0)}to{transform:translateX(-33.333%)}}`}</style>
    </div>
  );
}
window.Marquee = Marquee;
