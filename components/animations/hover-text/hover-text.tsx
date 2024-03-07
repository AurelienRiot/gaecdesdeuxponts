import './style.css';

const HoverText = () => {
  return (  
    <div className="text-lg  hover-text">
      <p className='relative'>text before</p>
      <span className='relative'> Hover text</span>
      <p className='relative'>text after</p>
    </div>
  );
}
 
export default HoverText;