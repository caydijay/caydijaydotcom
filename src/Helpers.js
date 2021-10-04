import { useHistory, useLocation } from 'react-router-dom';

const createWorkerFromFunction = (fn) => {
  const blob = new Blob(
    [ 'onmessage = ', fn.toString() ],
    { type: 'text/javascript' }
  )
  return new Worker(URL.createObjectURL(blob), { type: 'module' });
}

const useQueryParameters = (queryParameters) => {
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const history = useHistory();
  return {
    get: () => {
      return queryParameters.reduce((reduction, variable) => {
        return {
          [variable]: urlSearchParams.get(variable),
          ...reduction
        }
      }, {})
    },
    update: (get) => {
      queryParameters.forEach((variable) => {
        urlSearchParams.set(variable, get(variable))
      });
      history.push(`${location.pathname}?${urlSearchParams}`);
    }
  }
}

export { createWorkerFromFunction, useQueryParameters };