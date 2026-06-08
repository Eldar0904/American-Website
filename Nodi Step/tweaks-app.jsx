/* tweaks-app.jsx — mounts the Tweaks panel and applies choices to the static page */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "hero": "split",
  "accent": "blue",
  "displayFont": "'Space Grotesk', sans-serif",
  "sparkles": false
}/*EDITMODE-END*/;

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    if (window.applyTweaks) window.applyTweaks(t);
  }, [t.hero, t.accent, t.displayFont, t.sparkles]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Hero layout" />
      <TweakRadio
        label="Style"
        value={t.hero}
        options={[
          { value: "showcase", label: "Showcase" },
          { value: "split", label: "Split" }
        ]}
        onChange={(v) => setTweak("hero", v)}
      />

      <TweakSection label="Accent theme" />
      <TweakRadio
        label="Palette"
        value={t.accent}
        options={[
          { value: "blue", label: "Blue" },
          { value: "cyan", label: "Cyan" },
          { value: "violet", label: "Violet" }
        ]}
        onChange={(v) => setTweak("accent", v)}
      />

      <TweakSection label="Typography" />
      <TweakRadio
        label="Display font"
        value={t.displayFont}
        options={[
          { value: "'Space Grotesk', sans-serif", label: "Grotesk" },
          { value: "'Sora', sans-serif", label: "Sora" },
          { value: "'Chakra Petch', sans-serif", label: "Chakra" }
        ]}
        onChange={(v) => setTweak("displayFont", v)}
      />

      <TweakSection label="Decoration" />
      <TweakToggle
        label="Spark accents"
        value={t.sparkles}
        onChange={(v) => setTweak("sparkles", v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<TweaksApp />);
