function Hero() {
  return (
    <section style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",overflow:"hidden",background:"#050505",color:"#fff",paddingTop:80}}>
      {/* Purple haze background */}
      <div aria-hidden="true" style={{position:"absolute",inset:0,background:"radial-gradient(circle at 15% 50%, rgba(99,36,178,0.22) 0%, transparent 50%), radial-gradient(circle at 85% 30%, rgba(235,0,188,0.18) 0%, transparent 50%)",pointerEvents:"none"}}/>
      {/* Watermark X */}
      <div aria-hidden="true" style={{position:"absolute",right:-80,top:"40%",fontFamily:"var(--xp-font-display)",fontWeight:900,fontSize:"36vw",lineHeight:1,opacity:0.04,color:"#fff",pointerEvents:"none",userSelect:"none"}}>X</div>

      <div style={{maxWidth:1280,margin:"0 auto",padding:"60px 32px",display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:48,alignItems:"center",width:"100%",position:"relative",zIndex:1}}>
        {/* Copy */}
        <div>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:32}}>
            <span style={{height:1,width:40,background:"#6324b2"}}/>
            <span style={{fontFamily:"var(--xp-font-tech)",fontSize:11,letterSpacing:"0.3em",textTransform:"uppercase",color:"#a0a0a0"}}>Joinville · SC · Desde 2018</span>
          </div>
          <h1 style={{fontFamily:"var(--xp-font-display)",fontWeight:900,fontSize:"clamp(64px, 9vw, 144px)",lineHeight:0.85,letterSpacing:"-0.02em",textTransform:"uppercase",margin:"0 0 28px"}}>
            Mova-se<br/>
            <span style={{background:"linear-gradient(90deg,#6324b2 0%,#eb00bc 50%,#ff5200 100%)",WebkitBackgroundClip:"text",backgroundClip:"text",color:"transparent"}}>Além</span><br/>
            dos Limites.
          </h1>
          <p style={{fontFamily:"var(--xp-font-body)",fontWeight:700,fontSize:14,letterSpacing:"0.04em",textTransform:"uppercase",color:"#a0a0a0",lineHeight:1.55,maxWidth:480,margin:"0 0 36px"}}>
            Educação em dança impulsionada por tecnologia premium. Junte-se ao futuro da educação em dança.
          </p>
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            <button style={{position:"relative",background:"#fff",color:"#050505",fontFamily:"var(--xp-font-tech)",fontWeight:700,fontSize:14,letterSpacing:"0.18em",textTransform:"uppercase",padding:"16px 28px",border:"none",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:10,clipPath:"polygon(15px 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%,0 15px)"}}>
              <span className="material-symbols-outlined" style={{fontSize:18}}>school</span>
              Matricule-se
            </button>
            <button style={{background:"transparent",border:"1px solid rgba(255,255,255,0.4)",color:"#fff",fontFamily:"var(--xp-font-tech)",fontWeight:700,fontSize:14,letterSpacing:"0.18em",textTransform:"uppercase",padding:"16px 28px",borderRadius:9999,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:10}}>
              Descubra Seu Estilo
              <span className="material-symbols-outlined" style={{fontSize:18}}>arrow_forward</span>
            </button>
          </div>
        </div>
        {/* Photo */}
        <div style={{position:"relative",aspectRatio:"4/5",borderRadius:24,overflow:"hidden",border:"1px solid #1f1f1f"}}>
          <img src="../../assets/photos/xpace-hero.jpg" alt="XPACE crew" style={{width:"100%",height:"100%",objectFit:"cover",filter:"contrast(1.05)"}}/>
          <div aria-hidden="true" style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.1) 50%, transparent 100%)"}}/>
          {/* Floating sticker */}
          <img src="../../assets/decor/xpace-sticker.png" alt="" style={{position:"absolute",top:-24,right:-24,width:120,transform:"rotate(8deg)"}}/>
          {/* Caption */}
          <div style={{position:"absolute",left:24,bottom:24,right:24,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <div>
              <div style={{fontFamily:"var(--xp-font-tech)",fontSize:10,letterSpacing:"0.25em",textTransform:"uppercase",color:"#a0a0a0"}}>ID: XP-001</div>
              <div style={{fontFamily:"var(--xp-font-display)",fontWeight:900,fontSize:28,textTransform:"uppercase",letterSpacing:"-0.01em"}}>Crew 2026</div>
            </div>
            <div style={{padding:"6px 12px",border:"1px solid rgba(255,255,255,0.4)",borderRadius:9999,fontFamily:"var(--xp-font-tech)",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",display:"inline-flex",gap:8,alignItems:"center"}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#00ff00",boxShadow:"0 0 8px #00ff00"}}/>
              Status: Active
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
window.Hero = Hero;
