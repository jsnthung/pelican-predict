from controller.fundamental_analysis.main import main as run_fundamental_analysis
from controller.technical_analysis.main import main as run_technical_analysis

def run_daily_update():
    print("🔁 Starting daily MongoDB update")

    try:
        print("📊 Running Fundamental Analysis...")
        run_fundamental_analysis()
        print("✅ Fundamental Analysis completed.\n")
    except Exception as e:
        print(f"❌ Error during Fundamental Analysis: {e}")

    try:
        print("📈 Running Technical Analysis...")
        run_technical_analysis()
        print("✅ Technical Analysis completed.\n")
    except Exception as e:
        print(f"❌ Error during Technical Analysis: {e}")

    print("✅ Daily update job finished.")

if __name__ == "__main__":
    run_daily_update()