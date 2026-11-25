
import { useState } from "react";
import { Plus } from "lucide-react";
import BottomSheet from "./components/BottomSheet";
import "./Home.css";

function Home() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleOpenSheet = () => {
    setIsBottomSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsBottomSheetOpen(false);
  };

  return (
    <div className="home-page">

      {/* Header */}
      <header className="home-header">
        <h2>Home</h2>

        <button
          type="button"
          className="add-button"
          onClick={handleOpenSheet}
          aria-label="Create new"
        >
          <Plus size={25} strokeWidth={2.5} />
        </button>
      </header>

      {/* Main Content */}
      <main className="home-content">
        <h1>Welcome to the Home Page</h1>
        <p>This is the content of the Home page.</p>
      </main>

      {/* Bottom Sheet */}
      {isBottomSheetOpen && (
        <BottomSheet
          title="Create something"
          onClose={handleCloseSheet}
        >
          <div className="create-options">
            <h3>What would you like to create?</h3>

            <button onClick={() => console.log("Create Flashcard")}>
              Create Flashcard
            </button>

            <button onClick={() => console.log("Create Deck")}>
              Create Deck
            </button>

            <button onClick={() => console.log("Create Collection")}>
              Create Collection
            </button>
          </div>
        </BottomSheet>
      )}

    </div>
  );
}

export default Home;
