<script lang="ts">
  export let color: string = 'currentColor';
</script>

<svg
  class="svg"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  stroke={color}
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M6 0V18Z" stroke-width="3" />
  <path d="M12 0V18Z" stroke-width="3" />
  <path d="M18 0V18Z" stroke-width="3" />
</svg>

<style>
  .svg {
    transform: rotate(0.5turn);
  }
  .svg > path {
    transform-origin: top;
    animation: bounce 2.2s ease infinite alternate;
  }
  .svg > path:nth-of-type(2) {
    animation-delay: -2.2s;
  }

  .svg > path:nth-of-type(3) {
    animation-delay: -3.7s;
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
