# Log Eagle browser adapter

Adapter to monitor websites and web application front-ends.

## Usage

Add the script to the header of your website or web application.

```html
<script
  src="https://unpkg.com/@logeagle/adapter-browser@2.0.1/dist/logeagle-adapter-browser.js"
  crossorigin
></script>
```

## Configuration

To initialize the adapter with your desired configuration, you need to pass the configuration object to the `init` method.

```html
<script
  src="https://unpkg.com/@logeagle/adapter-browser@2.0.1/dist/logeagle-adapter-browser.js"
  crossorigin
></script>

<script>
  window.logeagle && window.logeagle.init({ ticket: "2ATNP1AD70" });
</script>
```

## Documentation

Visit our [documentation](https://docslogeagle.jarviot.tech/docs/browser-adapter) for more.
