import { css } from "~styled-system/css";
import { Card } from "./Card";
import { HiSolidCamera } from "solid-icons/hi";

export const InteractionEditor = () => {
  return (
    <Card>
      <div class={css({ display: "grid", gap: "4" })}>
        <input
          class={css({ fontFamily: "serif", fontWeight: "title", fontSize: "xl", outline: "none" })}
          placeholder="“Cute dog”"
        />
        <div class={css({ display: "flex", justifyContent: "space-between", alignItems: "end" })}>
          <div
            class={css({
              w: "48",
              aspectRatio: "square",
              background: "gray.100",
              borderWidth: "thin",
              borderColor: "gray.200",
              borderRadius: "md",
              pos: "relative",
              zIndex: "0",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              _placeholder: {
                color: "gray.400",
              },
            })}
          >
            <div
              class={css({
                display: "grid",
                justifyItems: "center",
                fontWeight: "bold",
                color: "gray.400",
                gap: "1",
              })}
            >
              <div class={css({ fontSize: "2xl" })}>
                <HiSolidCamera />
              </div>
              <label>
                Upload a Photo
                <input
                  type="file"
                  name="photo"
                  class={css({ opacity: "0", appearance: "none", pos: "absolute", inset: "0", cursor: "pointer" })}
                />
              </label>
            </div>
          </div>
          <button
            classList={{
              [css({
                justifySelf: "end",
                paddingInline: "4",
                paddingBlock: "1",
                borderRadius: "sm",
                fontWeight: "bold",
                fontSize: "md",
              })]: true,
              [css({ bg: "gray.200", color: "gray.400", cursor: "not-allowed" })]: true,
              // [css({ bg: "orange.500", color: "white", cursor: "pointer" })]: true,
            }}
          >
            Save
          </button>
        </div>
      </div>
    </Card>
  );
};
