# promisesThrottle

限制 `Promise.all` 的执行数量，以避免过度消耗 CPU | Memory 。

# 参数

promisesThrottle(array, callback, [, config])

```js
promisesThrottle(
  [
    'http://example.com/',
    'http://example.com/',
    'http://example.com/',
    'http://example.com/',
    'http://example.com/',
    'http://example.com/',
  ],
  url => {
    return fetch(url);
  },
  {
    // 限制执行数量，默认为10
    limit: 10,

    // 执行期间每个任务间是否需要等待，默认不等待
    sleepTime: 0,

    // 执行进度回调，可用来设置进度条
    // 参数 progress 为当前执行进度
    // 默认空回调
    setProgress: progress => {},

    // 执行进度是否需要百分比，默认为 true
    isPercentage: true,
  }
);
```

# 用法示例

## 导入

```js
const { promisesThrottle } = require('./index.js');
```

## 演示用辅助函数

```js
const helperRandom = (min = 0, max = 10) => {
  return Math.floor(Math.random() * max + min);
};

const helperSleep = delay => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay);
  });
};

const mockJob = async index => {
  console.log('Promise实例创建到了：', index);
  await helperSleep(helperRandom(5, 50) * 100);
  console.log('Promise实例已经结束：', index);
  return Promise.resolve(index);
};
```

## 使用

```js
const arr = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  42, 43, 44, 45, 46, 47, 48, 49, 50,
];

promisesThrottle(arr, index => {
  return mockJob(index);
});
```
