<script lang="ts">
  export let color: string = 'currentColor';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill={color}
  stroke={color}
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg
>

<style>
  .icon {
    position: relative;
    display: inline-flex;
    justify-content: space-between;
    width: 13px;
    height: 13px;
    margin-right: 8px;
  }
  .icon > span {
    width: 3px;
    height: 100%;
    background-color: var(--brand);
    border-radius: 3px;
    transform-origin: bottom;
    transition: opacity 0.3s ease-out;
    animation: bounce 2.2s ease infinite alternate;
    content: '';
  }
  .icon > span:nth-of-type(2) {
    animation-delay: -2.2s;
  }

  .icon > span:nth-of-type(3) {
    animation-delay: -3.7s;
  }

  .cover {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    border-radius: 2px;
    opacity: 0;
    transition: opacity 0.3s ease-out;
  }

  @keyframes bounce {
    10% {
      transform: scaleY(0.3);
    }

    30% {
      transform: scaleY(1);
    }

    60% {
      transform: scaleY(0.5);
    }

    80% {
      transform: scaleY(0.75);
    }

    100% {
      transform: scaleY(0.6);
    }
  }
</style>
