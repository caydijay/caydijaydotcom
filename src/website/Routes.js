import News from './content/News';
import Things from './content/things/Things';
import Genshin from './content/things/genshin/Genshin';
import RoyalCrit from './content/things/genshin/royal_crit/RoyalCrit.jsx';
import Rom from './content/things/rom/Rom';
import Thoughts from './content/thoughts/Thoughts';
import Food from './content/thoughts/food/Food';
import Music from './content/thoughts/music/Music';

const ROUTES = {
  labels: ['news', 'things', 'thoughts'],
  news: {
    component: News,
    label: 'news',
    resourceLocation: '',
    exact: true,
  },
  things: {
    component: Things,
    label: 'things',
    resourceLocation: 'things',
    labels: ['genshin', 'rom'],
    genshin: {
      component: Genshin,
      label: 'genshin',
      resourceLocation: 'genshin',
      labels: ['royal crit'],
      'royal crit': {
        component: RoyalCrit,
        label: 'royal crit',
        resourceLocation: 'royal-crit'
      },
    },
    rom: {
      component: Rom,
      label: 'rom',
      resourceLocation: 'rom',
    }
  },
  thoughts: {
    component: Thoughts,
    label: 'thoughts',
    resourceLocation: 'thoughts',
    labels: ['food', 'music'],
    food: {
      component: Food,
      label: 'food',
      resourceLocation: 'food',
    },
    music: {
      component: Music,
      label: 'music',
      resourceLocation: 'music',
    },
  },
}

export default ROUTES;