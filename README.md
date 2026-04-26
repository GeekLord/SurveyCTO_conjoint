# Image Pair Vote (SurveyCTO field plug-in)

This custom SurveyCTO field plug-in shows two images side by side and lets the respondent vote for one option by tapping the button under the image.

## What this plug-in is for

Use this when your XLSForm already computes which two image filenames should be shown (for example with `pulldata()` from a `stimuli_manifest.csv` file), and you want to present those two images as a forced choice.

## Parameters

Add this plug-in to a `text` field and configure it with `custom-image-pair-vote(...)` style parameters.

| Key | Required | Description |
| --- | --- | --- |
| `left_image` | Yes | Filename/path for the left image (for example from a calculate field). |
| `right_image` | Yes | Filename/path for the right image. |
| `labels` | No | Comma-separated button labels for left and right buttons. Default: `Option 1,Option 2`. |
| `top_text` | No | Text above both images. |
| `left_text` | No | Text above the left image. |
| `right_text` | No | Text above the right image. |
| `bypass` | No | If provided, shows a third “none/skip” button below both options. |
| `data_format` | No | `numeric` (default) stores `1`, `2`, or `0` (bypass). `string` stores the selected label text. |

## Answer values stored

- Default (`data_format = numeric`):
  - `1` when left option is chosen
  - `2` when right option is chosen
  - `0` when bypass is chosen
- With `data_format = string`:
  - stores the label text of the selected button

## Example appearance

```text
custom-image-pair-vote(
  left_image='${left_filename}',
  right_image='${right_filename}',
  labels='Image A,Image B',
  top_text='Which post is more convincing?',
  left_text='Post A',
  right_text='Post B',
  bypass='Neither'
)
```

## Notes for SurveyCTO media files

- Upload all referenced images with the form.
- If you pass just a filename (e.g. `HIND_NEG_01_crude_HIGH_jagran.png`), the plug-in will try both that filename directly and `jr://images/<filename>` as a fallback on device.
- You can generate those filenames from `pulldata()` against your CSV manifest.
