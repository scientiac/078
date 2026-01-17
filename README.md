# BCT 2078 Collaborative Canvas

A shared digital canvas for students of BCT 2078 to showcase individual creative works. Each contributor owns a fixed canvas area identified by their roll number and is free to design within that space using HTML, CSS, JavaScript, and other web assets.

Live canvas: [PUR078BCT](https://pur078bct.spandanguragain.com.np)

---

## Project Structure

Each contributor has a directory named after their roll number at the root of the repository. All assets related to that artwork must remain inside the corresponding roll number directory.

```
.
├── <roll-no>/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets (images, audio, etc.)
├── index.html
├── public-canvas.txt
├── style.css
├── script.js
└── README.md
```

The `public-canvas.txt` file maintains the list of roll numbers currently participating in the canvas.

---

## How to Add Your Art

1. Fork this repository and clone it to your local system.
2. From the root directory, start a local server (for example, using `live-server`).
3. Create a new directory named exactly as your roll number (for example: `86`).
4. Add your roll number to `public-canvas.txt` as a comma-separated value.
5. Inside your roll number directory, create an `index.html` file and build your artwork.
6. Add any required CSS, JavaScript, images, audio, or other assets inside your roll number directory only.
7. Verify that your artwork renders correctly when viewed through the main site.
8. Sign your artwork clearly by including your name somewhere within your canvas.
9. Remove unnecessary temporary files or add them to `.gitignore`.
10. Push your changes and open a pull request.

Your pull request will be merged if it meets all project requirements.

---

## Rules and Constraints

### Canvas Limits

* Your view must not scroll beyond the assigned canvas size.
* Any artwork that causes overflow outside the canvas will be asked to be reworked.

### Compatibility

* Test your canvas on different screen sizes.
* Check both light mode and dark mode rendering.
* Ensure all internal and external links work correctly.

### Organization

* Keep all files related to your work inside your roll number directory.
* Do not modify other contributors' directories.
* Do not rename or restructure the root-level files unless explicitly required.

---

## Review Criteria

A pull request will be accepted only if:

* The roll number directory is correctly named and registered in `public-canvas.txt`.
* The artwork stays within the canvas bounds.
* The contributor name is clearly visible.
* The project builds and runs without errors.
* No unnecessary or broken files are included.

---

## Notes

This project is intended as a collaborative archive of creativity. Feel free to experiment, but respect the shared structure so that everyone’s work integrates cleanly into the canvas.
