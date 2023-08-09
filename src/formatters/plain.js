import _ from 'lodash';

const updateValue = (value) => {
  const type = typeof value;

  if (type === 'string') {
    return `'${value}'`;
  }

  if (_.isObject(value)) {
    return '[complex value]';
  }

  return value;
};

const plainFormatter = (tree) => {
  const data = {
    added: 'was added with value:',
    deleted: 'was removed',
    changed: 'was updated.',
  };

  const iter = (node, path) => {
    const lines = node
      .filter((item) => {
        const { status } = item;
        return status !== 'unchanged';
      })
      .map((item) => {
        const { key } = item;
        if (Object.hasOwn(item, 'children')) {
          const { children } = item;
          return iter(children, [...path, key]);
        }

        const {
          status, value, from, to,
        } = item;

        const joinPath = [...path, key].join('.');

        if (status === 'added') {
          return `Property '${joinPath}' ${data[status]} ${updateValue(value)}`;
        }

        if (status === 'deleted') {
          return `Property '${joinPath}' ${data[status]}`;
        }

        return `Property '${joinPath}' ${data[status]} From ${updateValue(from)} to ${updateValue(to)}`;
      });

    return [...lines].join('\n');
  };

  const result = iter(tree, []);

  return result;
};

export default plainFormatter;