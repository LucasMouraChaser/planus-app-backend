# **App Name**: Energisa Invoice Editor

## Core Features:

- Invoice Display: Display a fully rendered Energisa invoice within an editable SVG.
- Real-Time Field Editing: Enable direct text editing of invoice fields via input and textarea elements overlaid on the SVG.
- Save Data to JSON: Allow users to save the edited invoice data (captured from the fields), into a JSON file. This will essentially dump the 'state' of the form.
- Overlapping Form Sanity Check: The app's UI code detects if there are overlapping form elements; it flags them on the UI (without making changes), and displays warnings.

## Style Guidelines:

- Primary color: A subdued green (#8FBC8F), mirroring Energisa's brand while maintaining a neutral feel.
- Background color: Light gray (#E0E0E0), providing a clean backdrop that allows the invoice details to stand out.
- Accent color: Soft blue (#B0C4DE) to highlight interactive elements.
- Body and headline font: 'PT Sans' (sans-serif) for clear readability and a modern aesthetic.
- Simple, monochromatic icons for interactive elements (e.g., save, load), prioritizing clarity and ease of use.
- A clean, single-column layout to focus on the invoice editing area. Use clear visual separation between sections.
- Subtle transitions for interactive elements (e.g., button hover effects) to provide feedback without distracting from the editing process.