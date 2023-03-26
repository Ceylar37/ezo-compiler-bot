export function taskRunner(cb: Function, delay: number): { run(): void; stop(): void } {
  let timeoutInst: ReturnType<typeof setTimeout>;

  function run() {
    clearTimeout(timeoutInst);
    try {
      cb();
      timeoutInst = setTimeout(run, delay);
    } catch (e) {}
  }
  function stop() {
    clearTimeout(timeoutInst);
  }

  return {
    run,
    stop,
  };
}
