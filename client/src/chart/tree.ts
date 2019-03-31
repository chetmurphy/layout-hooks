import TreeMap from './TreeMap';

const t1 = new TreeMap([
  ['a', {
    name: 'a',
    parent: '',
    children: ['aa', 'ab', 'ac'],
    info: 'a'
  }],
    ['aa', {
      name: 'aa',
      parent: 'a',
      children: ['aaa', 'aab'],
      info: 'aa'
    }],
      ['aaa', {
        name: 'aaa',
        parent: 'aa',
        children: [],
        info: 'aaa'
      }],
      ['aab', {
        name: 'aab',
        parent: 'aa',
        children: [],
        info: 'aab'
      }],
  ['ab', {
    name: 'ab',
    parent: 'a',
    children: ['aba', 'abb'],
    info: 'ab'
  }],
    ['aba', {
      name: 'aba',
      parent: 'ab',
      children: [],
      info: 'aba'
    }],
    ['abb', {
      name: 'abb',
      parent: 'ab',
      children: [],
      info: 'abb'
    }],

  ['ac', {
    name: 'ac',
    parent: 'a',
    children: ['aca', 'acb'],
    info: 'ac'
  }],
    ['aca', {
      name: 'aca',
      parent: 'ac',
      children: [],
      info: 'aca'
    }],
    ['acb', {
      name: 'acb',
      parent: 'ac',
      children: [],
      info: 'acb'
    }],
]);

export { t1 }