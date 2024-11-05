import * as math from 'mathjs';

export const solveLinearEquation = (input: string) => {
  // Parse equation like "2*x + y = 10"
  const [leftSide, rightSide] = input.split('=').map(p => p.trim());
  
  // Move all terms to left side: "2*x + y - 10 = 0"
  const equation = `${leftSide}-(${rightSide})`;
  
  try {
    // Parse and collect terms
    const expr = math.parse(equation);
    const simplified = math.simplify(expr);
    
    // Extract coefficients
    const terms = simplified.toString().split(/[+\-]/).map(term => term.trim());
    const coefficients: Record<string, number> = {};
    
    terms.forEach(term => {
      if (term.includes('x')) {
        coefficients.x = parseFloat(term.replace('x', '')) || 1;
      } else if (term.includes('y')) {
        coefficients.y = parseFloat(term.replace('y', '')) || 1;
      } else {
        coefficients.constant = parseFloat(term) || 0;
      }
    });
    
    // Solve for x and y
    const x = -coefficients.constant / coefficients.x;
    const y = -(coefficients.constant + coefficients.x * x) / coefficients.y;
    
    return {
      steps: [
        {
          description: "Équation initiale",
          expression: input
        },
        {
          description: "Réorganisation des termes",
          expression: `${simplified.toString()} = 0`
        },
        {
          description: "Résolution pour x",
          expression: `x = ${x.toFixed(2)}`
        },
        {
          description: "Résolution pour y",
          expression: `y = ${y.toFixed(2)}`
        }
      ],
      finalResult: `x = ${x.toFixed(2)}, y = ${y.toFixed(2)}`,
      variables: { x, y }
    };
  } catch (error) {
    throw new Error("Impossible de résoudre l'équation. Vérifiez le format.");
  }
};

export const generateSteps = (input: string, operation: string) => {
  const solution = {
    steps: [],
    finalResult: '',
    variables: {}
  };

  switch (operation) {
    case 'linear':
      return solveLinearEquation(input);

    case 'derivative':
      const derivative = math.derivative(input, 'x');
      return {
        steps: [
          {
            description: "Expression initiale",
            expression: input
          },
          {
            description: "Application des règles de dérivation",
            expression: derivative.toString()
          }
        ],
        finalResult: derivative.toString()
      };

    default:
      const result = math.evaluate(input);
      return {
        steps: [
          {
            description: "Expression initiale",
            expression: input
          }
        ],
        finalResult: result.toString()
      };
  }
};