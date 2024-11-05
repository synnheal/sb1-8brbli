import tkinter as tk
from tkinter import ttk, messagebox
import math
import json
from datetime import datetime
import sympy as sp
from typing import Dict, List, Optional
import ttkthemes
from dataclasses import dataclass
from enum import Enum
import uuid

class Category(Enum):
    ANALYSIS = "analysis"
    ALGEBRA = "algebra"
    PROBABILITY = "probability"
    ALGORITHMS = "algorithms"
    SEQUENCES = "sequences"

@dataclass
class Step:
    description: str
    expression: str

@dataclass
class Solution:
    steps: List[Step]
    final_result: str
    variables: Optional[Dict[str, float]] = None

@dataclass
class HistoryItem:
    id: str
    category: Category
    operation: str
    input: str
    solution: Solution
    timestamp: float

class Theme(Enum):
    LIGHT = "light"
    DARK = "dark"

class AdvancedCalculator:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Calculateur Mathématique Avancé")
        self.root.geometry("1200x800")
        
        # Initialize theme
        self.style = ttkthemes.ThemedStyle(self.root)
        self.current_theme = Theme.LIGHT
        self.apply_theme()

        # State variables
        self.current_category = Category.ANALYSIS
        self.history: List[HistoryItem] = self.load_history()
        
        self.setup_ui()
        self.load_operations()

    def apply_theme(self):
        if self.current_theme == Theme.DARK:
            self.style.set_theme("equilux")
            bg_color = "#2d2d2d"
            fg_color = "white"
        else:
            self.style.set_theme("arc")
            bg_color = "white"
            fg_color = "black"
            
        self.root.configure(bg=bg_color)
        
    def toggle_theme(self):
        self.current_theme = Theme.DARK if self.current_theme == Theme.LIGHT else Theme.LIGHT
        self.apply_theme()

    def setup_ui(self):
        # Main container
        self.main_container = ttk.PanedWindow(self.root, orient=tk.HORIZONTAL)
        self.main_container.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        # Sidebar
        self.sidebar = ttk.Frame(self.main_container)
        self.main_container.add(self.sidebar, weight=1)

        # Calculator area
        self.calculator_frame = ttk.Frame(self.main_container)
        self.main_container.add(self.calculator_frame, weight=3)

        self.setup_sidebar()
        self.setup_calculator()
        self.setup_history()

    def setup_sidebar(self):
        ttk.Label(self.sidebar, text="Catégories", font=("Arial", 16, "bold")).pack(pady=10)
        
        for category in Category:
            btn = ttk.Button(
                self.sidebar,
                text=category.value.capitalize(),
                command=lambda c=category: self.change_category(c)
            )
            btn.pack(fill=tk.X, pady=5, padx=10)

    def setup_calculator(self):
        # Header
        header = ttk.Frame(self.calculator_frame)
        header.pack(fill=tk.X, pady=10)

        ttk.Label(
            header,
            text="Calculateur Mathématique Avancé",
            font=("Arial", 20, "bold")
        ).pack(side=tk.LEFT)

        ttk.Button(
            header,
            text="🌙" if self.current_theme == Theme.LIGHT else "☀️",
            command=self.toggle_theme
        ).pack(side=tk.RIGHT)

        # Operation selection
        self.operations_frame = ttk.Frame(self.calculator_frame)
        self.operations_frame.pack(fill=tk.X, pady=10)

        # Input area
        input_frame = ttk.Frame(self.calculator_frame)
        input_frame.pack(fill=tk.X, pady=10)

        ttk.Label(input_frame, text="Expression mathématique").pack(anchor=tk.W)
        
        self.input_var = tk.StringVar()
        self.input_entry = ttk.Entry(input_frame, textvariable=self.input_var)
        self.input_entry.pack(fill=tk.X, pady=5)

        # Calculate button
        ttk.Button(
            input_frame,
            text="Calculer",
            command=self.calculate
        ).pack(fill=tk.X, pady=10)

        # Results area
        self.result_frame = ttk.Frame(self.calculator_frame)
        self.result_frame.pack(fill=tk.BOTH, expand=True)

    def setup_history(self):
        self.history_frame = ttk.Frame(self.calculator_frame)
        self.history_frame.pack(fill=tk.X, pady=10)
        
        header = ttk.Frame(self.history_frame)
        header.pack(fill=tk.X)
        
        ttk.Label(header, text="Historique", font=("Arial", 14, "bold")).pack(side=tk.LEFT)
        ttk.Button(header, text="Effacer", command=self.clear_history).pack(side=tk.RIGHT)

        self.history_list = ttk.Treeview(
            self.history_frame,
            columns=("operation", "input", "result", "time"),
            show="headings"
        )
        
        self.history_list.heading("operation", text="Opération")
        self.history_list.heading("input", text="Expression")
        self.history_list.heading("result", text="Résultat")
        self.history_list.heading("time", text="Heure")
        
        self.history_list.pack(fill=tk.X, pady=5)
        self.update_history_display()

    def load_operations(self):
        self.operations = {
            Category.ANALYSIS: [
                ("limit", "Limite", "lim(x -> 0, sin(x)/x)"),
                ("derivative", "Dérivée", "x^2 + 2*x + 1"),
                ("integral", "Intégrale", "x^2 + 2*x + 1"),
            ],
            Category.ALGEBRA: [
                ("matrix", "Calcul matriciel", "[1, 2; 3, 4]"),
                ("linear", "Système linéaire", "2*x + y = 10"),
                ("vector", "Calcul vectoriel", "[1, 2, 3] * [4, 5, 6]"),
            ],
            # Add other categories...
        }
        
        self.update_operations_display()

    def update_operations_display(self):
        for widget in self.operations_frame.winfo_children():
            widget.destroy()

        for op_id, name, placeholder in self.operations[self.current_category]:
            frame = ttk.Frame(self.operations_frame)
            frame.pack(fill=tk.X, pady=5)
            
            ttk.Button(
                frame,
                text=name,
                command=lambda o=op_id: self.select_operation(o)
            ).pack(side=tk.LEFT)
            
            ttk.Label(frame, text=f"Ex: {placeholder}").pack(side=tk.LEFT, padx=10)

    def calculate(self):
        expression = self.input_var.get()
        if not expression:
            messagebox.showerror("Erreur", "Veuillez entrer une expression")
            return

        try:
            # Use sympy for symbolic mathematics
            x, y = sp.symbols('x y')
            expr = sp.sympify(expression)
            
            if self.current_operation == "derivative":
                result = sp.diff(expr, x)
            elif self.current_operation == "integral":
                result = sp.integrate(expr, x)
            else:
                result = expr.evalf()

            solution = Solution(
                steps=[
                    Step("Expression initiale", str(expr)),
                    Step("Résultat", str(result))
                ],
                final_result=str(result)
            )

            # Add to history
            history_item = HistoryItem(
                id=str(uuid.uuid4()),
                category=self.current_category,
                operation=self.current_operation,
                input=expression,
                solution=solution,
                timestamp=datetime.now().timestamp()
            )
            
            self.add_to_history(history_item)
            self.display_solution(solution)

        except Exception as e:
            messagebox.showerror("Erreur", str(e))

    def display_solution(self, solution: Solution):
        # Clear previous results
        for widget in self.result_frame.winfo_children():
            widget.destroy()

        # Display steps
        ttk.Label(
            self.result_frame,
            text="Solution détaillée",
            font=("Arial", 14, "bold")
        ).pack(pady=10)

        for step in solution.steps:
            frame = ttk.Frame(self.result_frame)
            frame.pack(fill=tk.X, pady=5)
            
            ttk.Label(frame, text=step.description).pack(anchor=tk.W)
            ttk.Label(
                frame,
                text=step.expression,
                font=("Courier", 12)
            ).pack(anchor=tk.W, padx=20)

        # Display final result
        result_frame = ttk.Frame(self.result_frame)
        result_frame.pack(fill=tk.X, pady=10)
        
        ttk.Label(
            result_frame,
            text="Résultat final:",
            font=("Arial", 12, "bold")
        ).pack(side=tk.LEFT)
        
        ttk.Label(
            result_frame,
            text=solution.final_result,
            font=("Courier", 12)
        ).pack(side=tk.LEFT, padx=10)

    def load_history(self) -> List[HistoryItem]:
        try:
            with open("history.json", "r") as f:
                data = json.load(f)
                return [HistoryItem(**item) for item in data]
        except FileNotFoundError:
            return []

    def save_history(self):
        with open("history.json", "w") as f:
            json.dump([vars(item) for item in self.history], f)

    def add_to_history(self, item: HistoryItem):
        self.history.insert(0, item)
        self.history = self.history[:10]  # Keep only last 10 items
        self.save_history()
        self.update_history_display()

    def update_history_display(self):
        # Clear current display
        for item in self.history_list.get_children():
            self.history_list.delete(item)

        # Add history items
        for item in self.history:
            self.history_list.insert(
                "",
                0,
                values=(
                    item.operation,
                    item.input,
                    item.solution.final_result,
                    datetime.fromtimestamp(item.timestamp).strftime("%H:%M:%S")
                )
            )

    def clear_history(self):
        self.history = []
        self.save_history()
        self.update_history_display()

    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    calculator = AdvancedCalculator()
    calculator.run()