import {Route,Switch} from 'wouter';
import {Provider} from './components/provider';
import {AgentFeedback,RunableBadge} from '@runablehq/website-runtime';
import {Shell} from './components/phantom/shell';
import Home from './pages/home';
import About from './pages/about';
import Project from './pages/project';
import Careers,{CareerDetail} from './pages/careers';
import Contact from './pages/contact';
import Legal from './pages/legal';
function App(){return <Provider><Shell><Switch><Route path="/" component={Home}/><Route path="/projects/:slug" component={Project}/><Route path="/about/:slug" component={About}/><Route path="/about"><About/></Route><Route path="/careers" component={Careers}/><Route path="/careers/:slug/apply" component={CareerDetail}/><Route path="/careers/:slug" component={CareerDetail}/><Route path="/contact" component={Contact}/><Route path="/lets-talk" component={Contact}/><Route path="/:slug" component={Legal}/></Switch></Shell>{import.meta.env.DEV&&<AgentFeedback/>}<RunableBadge/></Provider>}
export default App;
