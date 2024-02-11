import '../assets/styles/Aside.scss'

const Aside = () => {
  return (
    <aside className="aside">
      <div>Logo</div>
      <nav>
        <a href="#link1">Dashboard</a> 
        <a href="#link2">Create Budget</a> 
        <a href="#link3">How To</a>
      </nav>
    </aside> // Fix: Replace <aside/> with </aside>
  );
};

export default Aside