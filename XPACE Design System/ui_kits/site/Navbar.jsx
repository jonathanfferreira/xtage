function Navbar() {
  const links = ["Filosofia", "Estilos", "Grade", "Eventos", "Planos", "Contato"];
  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:50,background:"rgba(5,5,5,0.85)",backdropFilter:"blur(20px)",borderBottom:"1px solid #1f1f1f"}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"14px 32px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <a href="#" style={{display:"flex",alignItems:"center",gap:10}}>
          <img src="../../assets/logo/xpace-perfil-white.png" alt="XPACE" style={{height:36}}/>
        </a>
        <div style={{display:"flex",gap:28}}>
          {links.map(l => (
            <a key={l} href="#" className="xp-nav-link" style={{fontFamily:"var(--xp-font-tech)",fontSize:13,letterSpacing:"0.18em",textTransform:"uppercase",color:"#fff",fontWeight:700,textDecoration:"none",position:"relative",padding:"6px 0"}}>
              {l}
            </a>
          ))}
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <button title="Tema" style={{background:"transparent",border:"1px solid #1f1f1f",borderRadius:9999,width:38,height:38,color:"#fff",cursor:"pointer",display:"grid",placeItems:"center"}}>
            <span className="material-symbols-outlined" style={{fontSize:18}}>dark_mode</span>
          </button>
          <button className="xp-cta-clip" style={{background:"#fff",color:"#050505",fontFamily:"var(--xp-font-tech)",fontSize:12,letterSpacing:"0.18em",textTransform:"uppercase",fontWeight:700,padding:"10px 18px",border:"none",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8,clipPath:"polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)"}}>
            Garantir Anual <span className="material-symbols-outlined" style={{fontSize:16}}>arrow_forward</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
window.Navbar = Navbar;
