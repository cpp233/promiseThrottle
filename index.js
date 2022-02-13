const promisesThrottle = async (arr, fn, option) => {
  const defaultOption = {
    limit: 10,
    sleepTime: 0,
    setProgress: () => {},
    isPercentage: true,
  };

  const { limit, sleepTime, setProgress, isPercentage } = Object.assign(
    defaultOption,
    option
  );

  let result = [];
  let promisesQueue = [];

  const helperSleepFn = delay => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, delay);
    });
  };

  let currentProgress = 0;
  const inlinePromise = pram =>
    fn(pram.promise).then(promise => {
      const progress = Math.floor(((currentProgress + 1) / arr.length) * 100);

      isPercentage ? setProgress(progress) : setProgress(currentProgress + 1);
      currentProgress++;

      return {
        index: pram.index,
        promise,
      };
    });

  for (let i = 0; i < arr.length; i++) {
    const p = inlinePromise({ promise: arr[i], index: i }).then(res => {
      result.push(res);
      const newP = promisesQueue.filter(item => {
        return item !== p;
      });
      promisesQueue = [...newP];
    });
    promisesQueue.push(p);

    if (promisesQueue.length >= limit || i + 1 === arr.length) {
      await Promise.race(promisesQueue);
      await helperSleepFn(sleepTime);
    }
  }

  await Promise.all(promisesQueue);

  return result
    .sort((item1, item2) => {
      return item1.index - item2.index;
    })
    .map(item => item.promise);
};

module.exports = {
  promisesThrottle,
};
