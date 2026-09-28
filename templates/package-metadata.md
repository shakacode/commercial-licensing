# Package metadata examples

Product-specific package metadata should point users to the binding product
license file and the public licensing explanation.

## npm package example

```json
{
  "license": "SEE LICENSE IN LICENSE.md",
  "homepage": "https://github.com/shakacode/shakaperf",
  "repository": {
    "type": "git",
    "url": "https://github.com/shakacode/shakaperf.git"
  }
}
```

## Ruby gemspec example

```ruby
spec.license = "SEE LICENSE IN REACT-ON-RAILS-PRO-LICENSE.md"
spec.homepage = "https://github.com/shakacode/react_on_rails"
spec.metadata["source_code_uri"] = "https://github.com/shakacode/react_on_rails"
spec.metadata["license_uri"] = "https://github.com/shakacode/react_on_rails"
```

Use product-specific package manager conventions when they require a more
specific license value.
